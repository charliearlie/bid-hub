export enum AlertType {
  ERROR = "error",
  INFO = "info",
  WARN = "warn",
}

const classes = {
  [AlertType.ERROR]: {
    background: "bg-red-100",
    border: "border-red-400",
    text: "text-red-700",
  },
  [AlertType.INFO]: {
    background: "bg-violet-200",
    border: "border-violet-500",
    text: "text-violet-800",
  },
  [AlertType.WARN]: {
    background: "bg-yellow-200",
    border: "border-yellow-500",
    text: "text-yellow-900",
  },
};

type Props = {
  message: string;
  title?: string;
  type: AlertType;
};

export default function Alert({
  message,
  title,
  type = AlertType.INFO,
}: Props) {
  const { background, border, text } = classes[type];
  return (
    <div
      className={`relative mb-4 w-full max-w-sm rounded border ${background} ${border} ${text} px-8 py-3`}
      role="alert"
      data-testid="alert-component"
    >
      {title && <strong className="font-bold">{title}</strong>}
      <span className="block font-bold sm:inline">{message}</span>
    </div>
  );
}
