-- Table: public.test

-- DROP TABLE IF EXISTS public.test;

CREATE TABLE IF NOT EXISTS public.test
(
    name "char"[] NOT NULL,
    description "char"[],
    "assignToUserId" bigint,
    status "char"[],
    "creationTimeInSec" date NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.test
    OWNER to oleh;