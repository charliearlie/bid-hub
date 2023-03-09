export type BidInputProps = {
  bid: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BidInput({ bid, onChange }: BidInputProps) {
  return (
    <>
      <span className="h10 flex w-3 items-center justify-center bg-transparent pl-2">
        £
      </span>
      <input
        type="number"
        className="text-md md:text-basecursor-default flex h-10 w-full items-center bg-transparent text-center font-semibold  text-gray-700 outline-none hover:text-black focus:text-black focus:outline-none"
        onChange={onChange}
        value={bid / 100}
      />
    </>
  );
}
