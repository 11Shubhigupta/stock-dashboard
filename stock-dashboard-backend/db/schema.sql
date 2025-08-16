PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS companies (
  symbol TEXT PRIMARY KEY,
  name   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS candles (
  symbol TEXT NOT NULL,
  date   TEXT NOT NULL,          -- ISO date
  open   REAL NOT NULL,
  high   REAL NOT NULL,
  low    REAL NOT NULL,
  close  REAL NOT NULL,
  volume INTEGER NOT NULL,
  PRIMARY KEY (symbol, date),
  FOREIGN KEY (symbol) REFERENCES companies(symbol)
);
