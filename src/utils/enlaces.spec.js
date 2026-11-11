import { describe, expect, it } from "vitest";

import {
  LONGITUD_MAXIMA_ENLACE,
  normalizarEnlaceHttp,
} from "./enlaces";

describe("normalizarEnlaceHttp", () => {
  it("acepta HTTP y HTTPS sin modificar la direccion", () => {
    expect(normalizarEnlaceHttp("  http://example.org  ")).toBe(
      "http://example.org"
    );
    expect(normalizarEnlaceHttp("http://intranet")).toBe("http://intranet");
    expect(
      normalizarEnlaceHttp("https://example.org/ruta?consulta=1#seccion")
    ).toBe("https://example.org/ruta?consulta=1#seccion");
    expect(normalizarEnlaceHttp("http://[::1]")).toBe("http://[::1]");
    expect(normalizarEnlaceHttp("https://münich.example")).toBe(
      "https://münich.example"
    );
  });

  it("acepta un valor vacio como campo opcional", () => {
    expect(normalizarEnlaceHttp("")).toBeNull();
    expect(normalizarEnlaceHttp("   ")).toBeNull();
    expect(normalizarEnlaceHttp(null)).toBeNull();
  });

  it("rechaza esquemas ausentes o peligrosos", () => {
    expect(normalizarEnlaceHttp("example.org")).toBeNull();
    expect(normalizarEnlaceHttp("javascript:alert(1)")).toBeNull();
    expect(normalizarEnlaceHttp("data:text/html,contenido")).toBeNull();
    expect(normalizarEnlaceHttp("ftp://example.org/archivo")).toBeNull();
  });

  it("rechaza direcciones malformadas o ambiguas", () => {
    expect(normalizarEnlaceHttp("https://")).toBeNull();
    expect(normalizarEnlaceHttp("http:example.org")).toBeNull();
    expect(normalizarEnlaceHttp("http:///example.org")).toBeNull();
    expect(normalizarEnlaceHttp("http://example.org:0")).toBeNull();
    expect(normalizarEnlaceHttp("https://example.org/ruta con espacios")).toBeNull();
    expect(normalizarEnlaceHttp("https://example.org\\@otro.example")).toBeNull();
    expect(normalizarEnlaceHttp("https://example.org:99999")).toBeNull();
    expect(normalizarEnlaceHttp("http://exa%mple.org")).toBeNull();
    expect(normalizarEnlaceHttp("http://%65xample.org")).toBeNull();
    expect(normalizarEnlaceHttp("http://256.256.256.256")).toBeNull();
  });

  it("rechaza valores que superan la longitud maxima", () => {
    const enlace = "https://example.org/" + "a".repeat(LONGITUD_MAXIMA_ENLACE);

    expect(normalizarEnlaceHttp(enlace)).toBeNull();
  });
});
