// controllers/traffic.controller.js

import Traffic from "../models/Traffic.js";

/* =================================
   MONTH RANGE
================================= */

const getMonthRange = (
  date = new Date()
) => {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1
  );

  return { start, end };
};

/* =================================
   PERCENTAGE CALCULATION
================================= */

const calculatePercentage = (
  current,
  previous
) => {
  if (previous === 0 && current > 0) {
    return 100;
  }

  if (previous === 0) {
    return 0;
  }

  return Number(
    (
      ((current - previous) / previous) *
      100
    ).toFixed(1)
  );
};

/* =================================
   GET TRAFFIC STATS
================================= */

export const getTrafficStats =
  async (req, res) => {
    try {
      // current month
      const currentMonth =
        getMonthRange(new Date());

      // last month
      const lastMonthDate =
        new Date();

      lastMonthDate.setMonth(
        lastMonthDate.getMonth() - 1
      );

      const lastMonth =
        getMonthRange(lastMonthDate);

      // total traffic
      const totalTraffic =
        await Traffic.countDocuments();

      // current month traffic
      const currentMonthTraffic =
        await Traffic.countDocuments({
          createdAt: {
            $gte: currentMonth.start,
            $lt: currentMonth.end,
          },
        });

      // last month traffic
      const lastMonthTraffic =
        await Traffic.countDocuments({
          createdAt: {
            $gte: lastMonth.start,
            $lt: lastMonth.end,
          },
        });

      // difference
      const difference =
        currentMonthTraffic -
        lastMonthTraffic;

      // trend
      const trend =
        difference >= 0
          ? "increase"
          : "decrease";

      // percentage
      const percentage =
        calculatePercentage(
          currentMonthTraffic,
          lastMonthTraffic
        );

      res.status(200).json({
        success: true,

        data: {
          totalTraffic,

          currentMonthTraffic,

          lastMonthTraffic,

          difference:
            Math.abs(difference),

          trend,

          percentage,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };