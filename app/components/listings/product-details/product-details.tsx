import { camelCaseToHumanReadable } from "~/util/utils";

type Value = string | number | Date | Array<string> | null | boolean;

type Options = Record<string, Value>;

type Props = {
  options: Options;
};

export const ProductDetails = ({ options }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(options).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return null;
        }

        return (
          <div className="grid grid-cols-2" key={key}>
            <p className="font-semibold">{camelCaseToHumanReadable(key)}</p>
            <Detail value={value} />
          </div>
        );
      })}
    </div>
  );
};

const Detail = ({ value }: { value: Value }) => {
  switch (typeof value) {
    case "string":
    case "number":
      return <p>{value}</p>;
    case "boolean":
      return <p>{value ? "Yes" : "No"}</p>;
    case "object":
      if (Array.isArray(value)) {
        return (
          <ul>
            {value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      }
      if (value instanceof Date) {
        return <p>{value.toLocaleDateString()}</p>;
      }
    default:
      return null;
  }
};
