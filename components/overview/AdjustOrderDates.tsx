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
        const diffMs = today.getTime() - shiftDay.getTime();
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (daysPassed > 0) {
          await axios.patch("/api/shift");
        }
      }
    };
    init();
  }, [shiftDate]);

  return null;
}
export default AdjustOrderDates;
