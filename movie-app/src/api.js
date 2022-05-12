// export const getReviews = async () => {
//   const res = await fetch(`${env}`);
//   const body = await res.json();
//   return body;
// };

export const getReviews = async ({
  order = "createdAt",
  offset = 0,
  limit = 6,
}) => {
  const query = `order=${order}&offset=${offset}&limit=${limit}`;
  const res = await fetch(`${env}?${query}`);
  if (!res.ok) {
    throw new Error("리뷰를 불러오는데 실패했습니다.");
  }
  const body = await res.json();
  return body;
};
