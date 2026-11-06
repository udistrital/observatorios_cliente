import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import {
  base64ABytes,
  etiquetaColumna,
  obtenerExtensionDocumento,
  validarFirmaDocumento,
} from "./documentViewer";

describe("documentViewer", () => {
  it("detecta el formato por nombre y usa el MIME como respaldo", () => {
    expect(obtenerExtensionDocumento("Informe.Final.DOCX", "")).toBe("docx");
    expect(obtenerExtensionDocumento("sin-extension", "application/pdf")).toBe("pdf");
    expect(obtenerExtensionDocumento("archivo.exe", "application/octet-stream")).toBe("");
  });

  it("decodifica base64 simple y data URI", () => {
    expect(Array.from(base64ABytes("JVBERi0="))).toEqual([37, 80, 68, 70, 45]);
    expect(Array.from(base64ABytes("data:application/pdf;base64,JVBERi0="))).toEqual([
      37, 80, 68, 70, 45,
    ]);
    expect(() => base64ABytes("JVBERi0=", 4)).toThrow("limite");
  });

  it("conserva archivos base64 que requieren varios bloques", () => {
    const original = new Uint8Array(3 * 1024 * 1024 + 7);
    original[original.length - 8] = 17;
    original[original.length - 7] = 29;
    original[original.length - 1] = 41;

    const resultado = base64ABytes(Buffer.from(original).toString("base64"));

    expect(resultado.byteLength).toBe(original.byteLength);
    expect(resultado[resultado.length - 8]).toBe(17);
    expect(resultado[resultado.length - 7]).toBe(29);
    expect(resultado[resultado.length - 1]).toBe(41);
  });

  it("valida las firmas de PDF, OLE y ZIP", () => {
    expect(() =>
      validarFirmaDocumento(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), "pdf")
    ).not.toThrow();
    expect(() =>
      validarFirmaDocumento(
        new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
        "doc"
      )
    ).not.toThrow();
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      libro,
      XLSX.utils.aoa_to_sheet([["Indicador", "Resultado"], ["Cobertura", 87]]),
      "Datos"
    );
    const xlsx = new Uint8Array(XLSX.write(libro, { type: "array", bookType: "xlsx" }));

    expect(() => validarFirmaDocumento(xlsx, "xlsx")).not.toThrow();
    expect(() => validarFirmaDocumento(xlsx, "docx")).toThrow("estructura interna");
    expect(() =>
      validarFirmaDocumento(new Uint8Array([0x4d, 0x5a, 0x90, 0x00]), "docx")
    ).toThrow(".docx");
  });

  it("genera etiquetas de columnas de hoja de calculo", () => {
    expect(etiquetaColumna(0)).toBe("A");
    expect(etiquetaColumna(25)).toBe("Z");
    expect(etiquetaColumna(26)).toBe("AA");
    expect(etiquetaColumna(701)).toBe("ZZ");
  });
});
