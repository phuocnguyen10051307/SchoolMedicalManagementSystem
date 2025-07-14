
function parseAgeGroup(ageGroup, vaccinationDate) {
  const [minAge, maxAge] = ageGroup.split("-").map(Number);
  const vacDate = new Date(vaccinationDate);

  // Tính khoảng ngày sinh phù hợp
  const minDate = new Date(vacDate);
  minDate.setFullYear(minDate.getFullYear() - maxAge);

  const maxDate = new Date(vacDate);
  maxDate.setFullYear(maxDate.getFullYear() - minAge);


  return {
    minDate: minDate.toISOString().split("T")[0],
    maxDate: maxDate.toISOString().split("T")[0],
  };
}

module.exports = parseAgeGroup;
