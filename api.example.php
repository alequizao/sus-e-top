<?php
/**
 * SUS É TOP — API de estatísticas
 *
 * Endpoints:
 *   POST api.php?acao=salvar     → grava uma sessão de questionário
 *   GET  api.php?acao=ranking    → agregados anônimos (últimos 30 dias)
 *   GET  api.php?acao=minhas&aluno=xxx → sessões de um dispositivo
 *   GET  api.php?acao=status     → checagem de saúde da API
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const DB_HOST = 'SEU_VALOR_AQUI';
const DB_NAME = 'SEU_VALOR_AQUI';
const DB_USER = 'SEU_VALOR_AQUI';
const DB_PASS = 'SEU_VALOR_AQUI';

function conectar(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}

function instalar(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS sessoes (
            id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
            aluno        VARCHAR(40)  NOT NULL,
            modo         VARCHAR(20)  NOT NULL DEFAULT 'todas',
            dificuldade  VARCHAR(20)  NOT NULL DEFAULT 'todas',
            capitulos    VARCHAR(40)  NOT NULL DEFAULT '',
            total        SMALLINT UNSIGNED NOT NULL,
            acertos      SMALLINT UNSIGNED NOT NULL,
            segundos     MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
            criado_em    DATETIME     NOT NULL,
            PRIMARY KEY (id),
            KEY idx_aluno (aluno),
            KEY idx_criado (criado_em)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

function corpoJson(): array
{
    $bruto = file_get_contents('php://input') ?: '';
    $dados = json_decode($bruto, true);
    return is_array($dados) ? $dados : [];
}

function responder(array $dados, int $codigo = 200): void
{
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = conectar();
    instalar($pdo);
} catch (Throwable $e) {
    responder(['ok' => false, 'erro' => 'banco indisponível'], 503);
}

$acao = $_GET['acao'] ?? 'status';

switch ($acao) {

    case 'salvar':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            responder(['ok' => false, 'erro' => 'use POST'], 405);
        }

        $d = corpoJson();
        $total   = max(0, (int)($d['total'] ?? 0));
        $acertos = max(0, min($total, (int)($d['acertos'] ?? 0)));
        if ($total === 0) {
            responder(['ok' => false, 'erro' => 'sessão vazia'], 400);
        }

        $aluno = preg_replace('/[^a-z0-9]/i', '', (string)($d['aluno'] ?? 'anonimo'));
        $aluno = substr($aluno !== '' ? $aluno : 'anonimo', 0, 40);

        $caps = $d['capitulos'] ?? [];
        $caps = is_array($caps) ? implode(',', array_map('intval', $caps)) : '';

        $st = $pdo->prepare("
            INSERT INTO sessoes (aluno, modo, dificuldade, capitulos, total, acertos, segundos, criado_em)
            VALUES (:aluno, :modo, :dif, :caps, :total, :acertos, :seg, NOW())
        ");
        $st->execute([
            ':aluno'   => $aluno,
            ':modo'    => substr((string)($d['modo'] ?? 'todas'), 0, 20),
            ':dif'     => substr((string)($d['dificuldade'] ?? 'todas'), 0, 20),
            ':caps'    => substr($caps, 0, 40),
            ':total'   => $total,
            ':acertos' => $acertos,
            ':seg'     => max(0, (int)($d['segundos'] ?? 0)),
        ]);

        responder(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);

    case 'minhas':
        $aluno = preg_replace('/[^a-z0-9]/i', '', (string)($_GET['aluno'] ?? ''));
        if ($aluno === '') {
            responder(['ok' => false, 'erro' => 'informe o aluno'], 400);
        }
        $st = $pdo->prepare("
            SELECT modo, dificuldade, capitulos, total, acertos, segundos, criado_em
            FROM sessoes WHERE aluno = :a ORDER BY id DESC LIMIT 100
        ");
        $st->execute([':a' => $aluno]);
        responder(['ok' => true, 'sessoes' => $st->fetchAll()]);

    case 'ranking':
        $st = $pdo->query("
            SELECT
                COUNT(*)                                   AS sessoes,
                COUNT(DISTINCT aluno)                      AS alunos,
                COALESCE(SUM(total), 0)                    AS questoes,
                COALESCE(ROUND(SUM(acertos) / NULLIF(SUM(total), 0) * 100), 0) AS aproveitamento
            FROM sessoes
            WHERE criado_em >= (NOW() - INTERVAL 30 DAY)
        ");
        responder(['ok' => true, 'geral' => $st->fetch()]);

    case 'status':
    default:
        responder(['ok' => true, 'app' => 'SUS É TOP', 'versao' => '1.0.0']);
}
