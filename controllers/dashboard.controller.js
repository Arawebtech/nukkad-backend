import Service from "../models/Service.js";
import Gallery from "../models/Gallery.js";
import Enquiry from "../models/Enquiry.js";
import Career from "../models/Career.js";

/* =================================
   GET DATE RANGE
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
   CALCULATE %
================================= */

const calculatePercentage = (
  current,
  previous
) => {
  if (
    previous === 0 &&
    current > 0
  ) {
    return 100;
  }

  if (previous === 0) {
    return 0;
  }

  return Number(
    (
      ((current - previous) /
        previous) *
      100
    ).toFixed(1)
  );
};

/* =================================
   COMPARE DATA
================================= */

const compareData = async (
  Model
) => {
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

  // total
  const total =
    await Model.countDocuments();

  // current month count
  const currentCount =
    await Model.countDocuments({
      createdAt: {
        $gte: currentMonth.start,
        $lt: currentMonth.end,
      },
    });

  // last month count
  const lastCount =
    await Model.countDocuments({
      createdAt: {
        $gte: lastMonth.start,
        $lt: lastMonth.end,
      },
    });

  // difference
  const difference =
    currentCount - lastCount;

  // trend
  const trend =
    difference >= 0
      ? "increase"
      : "decrease";

  // percentage
  const percentage =
    calculatePercentage(
      currentCount,
      lastCount
    );

  return {
    total,
    currentMonth: currentCount,
    lastMonth: lastCount,
    difference:
      Math.abs(difference),
    trend,
    percentage,
  };
};

/* =================================
   DASHBOARD STATS
================================= */

export const getDashboardStats =
  async (req, res) => {
    try {
      const [
        services,
        enquiry,
        career,
        gallery,
      ] = await Promise.all([
        compareData(Service),
        compareData(Enquiry),
        compareData(Career),
        compareData(Gallery),
      ]);

      res.status(200).json({
        success: true,

        data: {
          services,
          enquiry,
          career,
          gallery,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };