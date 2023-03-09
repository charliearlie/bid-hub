import { Car } from "@prisma/client";
import { useActionData, useSubmit } from "@remix-run/react";
import React, { MouseEvent, useState } from "react";
import Button from "../button";
import BidButton from "./bid-button";
import BidInput from "./bid-input";

type BidProps = {
  car: Car;
};

const calculateNextBid = (startingBid: number, winningBid?: number | null) => {
  if (winningBid) {
    return winningBid + 500;
  }
  return startingBid;
};

export default function Bid({ car }: BidProps) {
  const { id, startingPrice, winningBid } = item;
  const success = useActionData();
  const submit = useSubmit();

  if (!startingPrice) return null;
  const [bid, setBid] = useState<number>(
    calculateNextBid(startingPrice, winningBid)
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBid = Number(event.target.value) * 100;
    setBid(newBid);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const increaseOrDecrease = event.currentTarget.name;

    if (increaseOrDecrease === "increase") {
      setBid(bid + 100);
    } else {
      setBid(bid - 100);
    }
  };

  const placeBid = () => {
    const formData = new FormData();
    formData.append("intent", "bid");
    formData.append("bidAmount", `${bid}`);
    formData.append("itemId", `${id}`);
    submit(formData, { method: "post", replace: true });
  };

  return (
    <div>
      <div className="flex h-10 w-32 overflow-hidden rounded bg-white">
        <BidButton
          disabled={bid <= winningBid!}
          handleButtonClick={handleButtonClick}
          type="decrease"
        />
        <BidInput bid={bid} onChange={handleInputChange} />
        <BidButton
          disabled={false}
          handleButtonClick={handleButtonClick}
          type="increase"
        />
      </div>
      <Button name="intent" value="bid" variant="secondary" onClick={placeBid}>
        Bid now
      </Button>
      {success && <p>Bid placed successfully</p>}
    </div>
  );
}
