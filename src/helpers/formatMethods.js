export const formatAddress = (address) => {
  console.log(address)
  if(address.length === 42 && address[0] === "0" && address[1] === "x"){
    return address.substring(0,8) + "..." + address.substring(34,42);
  }
  return address;
}