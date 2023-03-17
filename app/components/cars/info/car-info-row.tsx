type Props = {
  label?: string;
  value?: string | number;
};

export default function CarInfoRow({ label, value }: Props) {
  if (!label || !value) return null;
  return (
    <li className="grid grid-cols-2 gap-2 p-2">
      <span className="font-bold">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
