"use client";

import { ShiftDate } from "@prisma/client";
import axios from "axios";
import { useEffect } from "react";

function AdjustOrderDates({ shiftDate }: { shiftDate: ShiftDate | null }) {
  useEffect(() => {
    const init = async () => {
      if (shiftDate) {
        const today = new Date().getDate();
        const shiftDay = new Date(shiftDate.createdAt).getDate();
        if (today - shiftDay > 0) {
          console.log("UPDATING");
          await axios.patch("/api/shift", { daysPassed: today - shiftDay });
        }
      }
    };
    init();
  }, []);

  return null;
}
export default AdjustOrderDates;
