DROP SCHEMA DOACOES;

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS doacoes;
USE doacoes;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    dataNascimento DATE,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    desabrigado BOOLEAN DEFAULT FALSE,
    problemaSaude TEXT,
    detalhamentoSaude TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de voluntários
CREATE TABLE voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    atuacao VARCHAR(100),
    municipioOrigem VARCHAR(100),
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de centros de distribuição
CREATE TABLE centro_distribuicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeProduto VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50),
    perecivel BOOLEAN DEFAULT FALSE
);

-- Tabela de doações
CREATE TABLE doacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    centro_id INT,
    quantidade INT DEFAULT 1,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (centro_id) REFERENCES centro_distribuicao(id)
);

-- Tabela de estoque
CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    centro_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT DEFAULT 0,
    UNIQUE (centro_id, produto_id),
    FOREIGN KEY (centro_id) REFERENCES centro_distribuicao(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE necessidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- 🔄 TRIGGER: ao inserir uma nova doação, atualiza o estoque
DELIMITER //
CREATE TRIGGER trg_atualiza_estoque_doacao
AFTER INSERT ON doacoes
FOR EACH ROW
BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM estoque
    WHERE centro_id = NEW.centro_id AND produto_id = NEW.produto_id;

    IF existe > 0 THEN
        UPDATE estoque
        SET quantidade = quantidade + NEW.quantidade
        WHERE centro_id = NEW.centro_id AND produto_id = NEW.produto_id;
    ELSE
        INSERT INTO estoque (centro_id, produto_id, quantidade)
        VALUES (NEW.centro_id, NEW.produto_id, NEW.quantidade);
    END IF;
END;
//
DELIMITER ;

-- 🔻 TRIGGER: ao remover uma doação (baixa), reduz do estoque
DELIMITER //
CREATE TRIGGER trg_baixa_estoque_doacao
AFTER DELETE ON doacoes
FOR EACH ROW
BEGIN
    UPDATE estoque
    SET quantidade = GREATEST(quantidade - OLD.quantidade, 0)
    WHERE centro_id = OLD.centro_id AND produto_id = OLD.produto_id;
END;
//
DELIMITER ;

INSERT INTO centro_distribuicao (nome, latitude, longitude) VALUES ("Laranjinha", 45, 55);
-- INSERT INTO produtos (nomeProduto,descricao,tipo,perecivel) VALUES ("Banana", "Isto é uma banana", "alimento", TRUE);
-- INSERT INTO  doacoes (produto_id, centro_id, quantidade) VALUES (1, 1, 4);

select * from voluntarios;

select * from usuarios;

select * from produtos;

SELECT * FROM necessidades;

SELECT * FROM centro_distribuicao;
