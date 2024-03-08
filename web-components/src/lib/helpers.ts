export function humanBytes(bytes: number, decPlaces = 3): string {
  for (const prefix of ["", "K", "M", "G", "T", "P"]) {
    if (bytes < 1024) {
      const [whole, frac] = bytes.toString().split(".");
      return `${whole}${frac ? `.${frac.slice(0, decPlaces)}` : ""} ${prefix}B`;
    }
    bytes /= 1024;
  }
  return "";
}

export function timestampStringToYearMonthString(timestamp: string): string {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  }); // eg. "Sep 2005"

  return formattedDate;
}

export function readableFacetName(facetName: string, facetField: string) {
  // convert camelcase name into a more readable form for f_organizationType field - eg. 'collegesAndUniversities' --> 'Colleges And Universities'
  if (facetField === "f_organizationType") {
    const nameWordsSeparated = facetName.split(/(?=[A-Z])/); // split on capital letter
    return nameWordsSeparated
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // capitalize each word and join with spaces
  } else {
    return facetName;
  }
}
