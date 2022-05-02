import axios from "axios";
import moment from "moment";

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, "days").unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    };
  });

  return formattedSparkline;
};

const formatMarketData = (data) => {
  let formattedData = [];

  data.forEach((item) => {
    const formattedSparkline = formatSparkline(item.sparkline_in_7d.price);

    const formattedItem = {
      ...item,
      sparkline_in_7d: {
        price: formattedSparkline,
      },
    };

    formattedData.push(formattedItem);
  });

  return formattedData;
};

export const getMarketData = async (sort, curr, number) => {
  try {
    console.log(sort);
    console.log(curr);
    console.log(number);

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${curr}&order=${sort}&page=1&per_page=${number}&sparkline=true&price_change_percentage=7d`
    );
    const data = response.data;
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
  }
};
