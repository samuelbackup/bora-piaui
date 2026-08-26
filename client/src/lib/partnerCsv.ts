export type PartnerProposalCsvRecord = {
  businessName: string;
  city: string;
  category: string;
  plan: string;
  editorialStatus: string;
  openingHours: string | null;
  createdAt: Date | string | number;
};

const CSV_HEADERS = [
  "Nome do negócio",
  "Cidade",
  "Categoria",
  "Plano",
  "Status editorial",
  "Horário informado",
  "Data de envio",
];

function escapeCsvValue(value: string | null | undefined) {
  let normalized = value ?? "";
  if (/^[=+\-@\t\r]/.test(normalized)) {
    normalized = `'${normalized}`;
  }
  return /[;"\r\n]/.test(normalized)
    ? `"${normalized.replace(/"/g, '""')}"`
    : normalized;
}

function formatSubmissionDate(value: PartnerProposalCsvRecord["createdAt"]) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Fortaleza",
  }).format(date);
}

/**
 * Exportação demonstrativa: deliberadamente não inclui telefone, endereço ou descrição livre.
 */
export function buildPartnerProposalsCsv(records: PartnerProposalCsvRecord[]) {
  const rows = records.map(record =>
    [
      record.businessName,
      record.city,
      record.category,
      record.plan,
      record.editorialStatus,
      record.openingHours,
      formatSubmissionDate(record.createdAt),
    ]
      .map(value => escapeCsvValue(value))
      .join(";")
  );

  return `\uFEFF${CSV_HEADERS.join(";")}\r\n${rows.join("\r\n")}`;
}

export function partnerProposalsCsvFilename(now = new Date()) {
  return `propostas-parceiros-bora-piaui-${now.toISOString().slice(0, 10)}.csv`;
}
