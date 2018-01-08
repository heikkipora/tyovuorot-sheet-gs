function HOURS(input) {
  if (input.map) {
    return input.map(HOURS);
  } else {
    if (isEmpty(input)) {
      return;
    } else if (isVacation(input)) {
      return 7.4;
    } else if (isZeroVacation(input)) {
      return 0;
    }
    
    var total = 0;
    input.split("/").map(valueToPeriod).forEach(function(period) {
      total += period.end - period.start;
    });
    return total;
  }
}

function hoursInCell(input, index, values) {
  if (isEmpty(input)) {
    return;
  } else if (isVacation(input)) {
    return isSixthVacationInRow(index, values) ? 0 : 7.4;
  } else if (isZeroVacation(input)) {
    return 0;
  }
  
  return input;
}

function isSixthVacationInRow(index, values) {
  if (index >= 5) {
    for (var i = index - 5; i < index; i++) {
      if (values[index] != "VL") {
        return false;
      }
    }
    return true;
  }
  return false;
}

function isRange(input) {
  return !isEmpty(input) && !isVacation(input) && !isZeroVacation(input);
}

function WORK_DAYS(range) {
  var days = 0;
  range.forEach(function(row) {
    if (isRange(row[0])) {
      days++;
    }
  });
  return days;
}

function EVENING_HOURS(range) {
  var total = 0;
  range.forEach(function(row) {
    if (isRange(row[0])) {
      row[0].split("/").map(valueToPeriod).forEach(function(period) {
        total += eveningHoursFromPeriod(period);
      });
    }
  });
  return total;
}

function SUNDAY_HOURS(rangeSpecification) {
  var condition = function (cell) { return cell.getFontColor() == "#ff0000"; };
  return sumByCondition(rangeSpecification, condition);
}


function eveningHoursFromPeriod(period) {
  if (period.start <= 18 && period.end <= 18) {
    return 0;
  }
  return period.end - Math.max(period.start, 18);
}

function valueToPeriod(value) {
  var period = value.replace(/[a-zA-Z]/g, "").replace(/:/g, ".").split("-");
  return { start: hoursMinutesToHours(period[0]), end: hoursMinutesToHours(period[1]) };
}

function isVacation(value) {
  return /VL|JP/i.test(value);
}

function isZeroVacation(value) {
  return /L|TS/i.test(value);
}

function isEmpty(value) {
  return !value || value == "" || /^(-|X|X !|V|N\/A)$/i.test(value);
}

function hoursMinutesToHours(value) {
  return Math.floor(value) + (value % 1) / 60 * 100;
}

/**
 * from https://github.com/clupascu/GoogleApps_SumByColor/blob/master/source.js
 * Sums all the values of cells in the given range that has a
 * specific condition.
 *
 * @param {rangeSpecification} rangeSpecification - the range to search against.
 * @param {condition} condition - a function that determines if the cell should be
 *        summed or not.
 * @return A sum of the cell values.
 * @customfunction
 */
function sumByCondition(rangeSpecification, condition) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var range = sheet.getRange(rangeSpecification);
  
  var sum = 0;
  
  for (var i = 1; i <= range.getNumRows(); i++) {
    for (var j = 1; j <= range.getNumColumns(); j++) {
      
      var cell = range.getCell(i, j);
      
      if(condition(cell)) {
        sum += parseFloat(cell.getValue() || 0);
      }
    }
  }
  
  return sum;
}
