export type DocumentType = "CPF" | "CNPJ"

export function documentLabel(type?: DocumentType | null): string {
  return type === "CPF" ? "CPF" : "CNPJ"
}

export function nameLabel(type?: DocumentType | null): string {
  return type === "CPF" ? "Nome completo" : "Razão social"
}
