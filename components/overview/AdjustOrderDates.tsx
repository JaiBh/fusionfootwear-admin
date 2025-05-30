"use client";

import { ShiftDate } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";

function AdjustOrderDates({ shiftDate }: { shiftDate: ShiftDate | null }) {
  useEffect(() => {
    const init = async () => {
      if (shiftDate) {
        const today = new Date();
        const shiftDay = new Date(shiftDate.createdAt);
        if (today.getDate() !== shiftDay.getDate()) {
          await axios.patch("/api/shift");
        }
      }
    };
    init();
  }, [shiftDate]);

  return null;
}
export default AdjustOrderDates;
