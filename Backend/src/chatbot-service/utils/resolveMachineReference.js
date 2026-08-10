const MACHINE_PRONOUNS = [
  "mesinnya",
  "mesin itu",
  "mesin tersebut",
  "itu",
  "tadi",
  "yang tadi",
];

const resolveMachineReference = (args, sessionContext) => {
  if (!args?.machine) return args;

  const value = String(args.machine).trim().toLowerCase();
  const isPronoun = MACHINE_PRONOUNS.some(
    (p) => value === p || value.includes(p),
  );

  if (!isPronoun) return args;

  if (sessionContext.lastMachineCode) {
    return { ...args, machine: sessionContext.lastMachineCode };
  }

  // Tidak ada context untuk resolve -> tandai supaya tool tidak dieksekusi
  return { ...args, __unresolved: true };
};

export default resolveMachineReference;
