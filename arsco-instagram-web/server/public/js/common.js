// UTIL
export const _COPY = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};
export const _getFileNameFromUrl = function(url) {
  return url.slice(url.lastIndexOf('/') + 1, url.length);
};
export class _Date {
  constructor(str) {
    if (!_Date.instance) {
      (function() {
        String.prototype.zf = function(len) {
          return '0'.slice(0, len - this.length) + this;
        };
        Number.prototype.zf = function(len) {
          return this.toString().zf(len);
        };
        Date.prototype.format = function(f) {
          var weekName, d, h;
          if (!this.valueOf()) return '';
          weekName = ['일', '월', '화', '수', '목', '금', '토'];
          (d = this), (h = -1);
          return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
              case 'yyyy':
                return d.getFullYear();
              case 'yy':
                return d
                  .getFullYear()
                  .toString()
                  .substring(2, 4);
              case 'MM':
                return (d.getMonth() + 1).zf(2);
              case 'dd':
                return d.getDate().zf(2);
              case 'E':
                return weekName[d.getDay()];
              case 'HH':
                return d.getHours().zf(2);
              case 'hh':
                return ((h = d.getHours() % 12) ? h : 12).zf(2);
              case 'mm':
                return d.getMinutes().zf(2);
              case 'ss':
                return d.getSeconds().zf(2);
              case 'a/p':
                return d.getHours() < 12 ? '오전' : '오후';
              default:
                return $1;
            }
          });
        };
        _Date.instance = true;
      })();
    }
    if (str) {
      this.date = new Date(str);
    } else {
      this.date = new Date();
    }
  }

  lastMonth() {
    var lastDayOfLastMonth = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0,
    ).getDate();
    if (this.date.getDate() > lastDayOfLastMonth) {
      this.date.setDate(lastDayOfLastMonth);
    }
    this.date.setMonth(this.date.getMonth() - 1);
    return this;
  }

  lastWeek() {
    var date = this.date.getDate();
    this.date.setDate(date - 7);
    return this;
  }

  start() {
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
    return this;
  }

  end() {
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
    this.date.setTime(this.date.getTime() + 86400000 - 1);
    return this;
  }

  done() {
    return this.date;
  }

  format(str) {
    return this.date.format(str);
  }
}
