import { v4 as uuidv4 } from "uuid";

let utils = {
  numberOnly: (value) => value.replace(/[^0-9.]/g, ""),
  validateEmailFormat(val) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(val);
  },
  validatePhoneFormat(val) { },
  getLocalFullDate_reverse(ms) {
    if (!ms) ms = new Date().getTime();

    let data = new Date(ms);
    let yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const D = [yyyy, mm, dd].join("-");

    return D;
  },
  getLocalFullDate(ms, seperator = "/") {
    if (!ms) ms = new Date().getTime();

    let data = new Date(ms);
    const yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const D = dd + seperator + mm + seperator + yyyy;

    return D;
  },
  getLocalFullDateBYFormat(ms, seperator = "/", format = "DD/MM/YYYY") {
    if (!ms) ms = new Date().getTime();

    let data = new Date(ms);
    const yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    if (format == "DD/MM/YYYY") return dd + seperator + mm + seperator + yyyy;
    else if (format == "MM/DD/YYYY")
      return mm + seperator + dd + seperator + yyyy;
    else if (format == "YYYY/MM/DD")
      return yyyy + seperator + mm + seperator + dd;
    else return dd + seperator + mm + seperator + yyyy;
  },
  getDuration(start, end, format = "D:H:M") {
    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(end - start);

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));

    if (format == "D:H:M") return `${days}D:${hours}H:${minutes}M`;
    else if (format == "H:M") return `${hours}H:${minutes}M`;
    else if (format == "days") return days;
    else if (format == "hours") return hours;
    else if (format == "minutes") return minutes;
  },
  getDateFromStartAndDaysDuration(date, durationDays, action = "+") {
    // Clone the start date to avoid modifying the original date object
    let startDate = new Date(date);
    const endDate = new Date(date);

    console.log(startDate.getDate(), durationDays, "startDate");
    // Calculate the end date by adding the duration in days

    let duration =
      action == "+"
        ? startDate.getDate() + durationDays
        : startDate.getDate() - durationDays;

    endDate.setDate(duration);

    return endDate;
  },
  shorternNumber(value) {
    value = parseInt(value);

    if (value >= 10000000) return (value / 10000000).toFixed(2) + "Cr";
    else if (value >= 100000) return (value / 100000).toFixed(2) + "L";
    else if (value >= 1000) return (value / 1000).toFixed(2) + "K";

    return value.toString();
  },

  getSlugFromUrl(url) {
    if (!url) return "";

    // Remove protocol and www
    url = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Remove query parameters and fragments
    url = url.split(/[?#]/)[0];

    // Get the last part of the URL path
    const parts = url.split("/");
    const lastPart = parts.pop() || parts.pop(); // Handle potential trailing slash

    // Remove file extension
    return lastPart.replace(/\.[^/.]+$/, "");
  },
  countWords(text) {
    // Trim the text to remove leading/trailing spaces and split by one or more whitespace characters
    const words = text.trim().split(/\s+/);
    // Handle case when text is empty after trimming
    return text.trim() === '' ? 0 : words.length;
  },

  getDurationFromDates(start, end, format = "D:H:M") {
    start = new Date(start || new Date().getTime()).getTime();
    end = new Date(end || new Date().getTime()).getTime();

    const timeDiff = Math.abs(end - start);

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));

    if (format == "D:H:M") return `${days}D:${hours}H:${minutes}M`;
    else if (format == "H:M") return `${hours}H:${minutes}M`;
    else if (format == "days") return days;
    else if (format == "hours") return hours;
    else if (format == "minutes") return minutes;
  },
  formateDateLabel: ({ ms, isDate = true, isTime = false, hideWeek = false, hideYear = false }) => {
    if (!ms) return "";

    const date = new Date(ms);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const weekday = weekdays[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = hideYear ? '' : String(date.getUTCFullYear()).slice(-2);

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    if (isDate && isTime)
      return `${hideWeek ? "" : `${weekday},`
        } ${day} ${month} ${year} | ${hours}:${minutes} ${ampm}`;
    else if (isDate)
      return `${hideWeek ? "" : `${weekday},`} ${day} ${month} ${year}`;
    else if (isTime) return `${hours}:${minutes} ${ampm}`;
  },

  getEasyDate(duration) {
    let [start, end] = [undefined, undefined];

    // "2022-11-06T10:15"

    if (duration == "tomorrow") {
      let date_Obj = new Date();
      let yyyy = date_Obj.getFullYear();
      let mm = date_Obj.getMonth() + 1;
      let dd = date_Obj.getDate() + 1;

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      start = [yyyy, mm, dd].join("-") + "T00:00";
      end = [yyyy, mm, dd].join("-") + "T23:59";
    } else if (duration == "today") {
      let date_Obj = new Date();
      let yyyy = date_Obj.getFullYear();
      let mm = date_Obj.getMonth() + 1;
      let dd = date_Obj.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      start = [yyyy, mm, dd].join("-") + "T00:00";
      end = [yyyy, mm, dd].join("-") + "T23:59";
    } else if (duration == "yesterday") {
      let date_Obj = new Date();
      let yyyy = date_Obj.getFullYear();
      let mm = date_Obj.getMonth() + 1;
      let dd = date_Obj.getDate() - 1;

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      start = [yyyy, mm, dd].join("-") + "T00:00";
      end = [yyyy, mm, dd].join("-") + "T23:59";
    } else if (duration == "week") {
      let date_Obj = new Date();
      let first = date_Obj.getDate() - date_Obj.getDay();
      let last = first + 6;

      let firstday = new Date(date_Obj.setDate(first));
      let lastday = new Date(date_Obj.setDate(last));

      {
        let yyyy = firstday.getFullYear();
        let mm = firstday.getMonth() + 1;
        let dd = firstday.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        start = [yyyy, mm, dd].join("-") + "T00:00";
      }
      {
        let yyyy = lastday.getFullYear();
        let mm = lastday.getMonth() + 1;
        let dd = lastday.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        end = [yyyy, mm, dd].join("-") + "T23:59";
      }
    }

    return { start, end };
  },
  getCustomFullDate(formate, type) {
    let date = new Date(),
      current_year = date.getFullYear(),
      current_day = date.getDate(),
      current_month = date.getMonth();

    let stack = [];

    if (formate == "day") {
      for (let i = 0; i < current_day; i++) {
        let start = new Date(current_year, current_month, i);
        let end = new Date(current_year, current_month, i);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (type == "office-ride") {
          stack.push({ index: i, start, end });
        } else {
          stack.push({
            index: i,
            start: JSON.stringify(start),
            end: JSON.stringify(end),
          });
        }
      }
    } else if (formate == "month") {
      for (let i = 0; i <= current_month; i++) {
        let start = new Date(current_year, i, 1);
        let end = new Date(current_year, i, 31);

        end = i == current_month ? new Date() : end;

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (type == "office-ride") {
          stack.push({ index: i, start, end });
        } else {
          stack.push({
            index: i,
            start: JSON.stringify(start),
            end: JSON.stringify(end),
          });
        }
      }
    } else if (formate == "week") {
      const weeks = [],
        firstDate = new Date(current_year, current_month, 1),
        lastDate = new Date(current_year, current_month + 1, 0),
        numDays = lastDate.getDate();

      let dayOfWeekCounter = firstDate.getDay();

      for (let date = 1; date <= numDays; date++) {
        if (date > current_day) break;

        if (dayOfWeekCounter === 0 || weeks.length === 0) {
          weeks.push([]);
        }
        weeks[weeks.length - 1].push(date);
        dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
      }

      weeks
        .filter((w) => !!w.length)
        .map((w, i) => {
          let start = new Date(current_year, current_month, w[0] - 1);
          let end = new Date(current_year, current_month, w[w.length - 1] - 1);

          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          if (type == "office-ride") {
            stack.push({ index: i, start, end });
          } else {
            stack.push({
              index: i,
              start: JSON.stringify(start),
              end: JSON.stringify(end),
            });
          }
        });
    }

    return stack;
  },
  formatDateTime(dateString, format = "YYYY-MM-DD") {

    const date = new Date(dateString);

    // Helper function to pad numbers with leading zeros
    const pad = (num) => String(num).padStart(2, "0");

    const year = date.getFullYear(); // Use local time
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const possible_formats = {
      "YYYY-MM-DD": `${year}-${month}-${day}`,
      "DD-MM-YYYY": `${day}-${month}-${year}`,
      "YYYY": `${year}`,
      "YYYY-MM-DDTHH:mm": `${year}-${month}-${day}T${hours}:${minutes}`,
      "HH:mm": `${hours}:${minutes}`,
      "HH:mm:SS": `${hours}:${minutes}:${seconds}`,
    };

    return possible_formats[format] || dateString;
  },
  getCurrent_Day(type) {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    if (type == "office-ride") {
      return { start: start, end: end };
    } else {
      return { start: JSON.stringify(start), end: JSON.stringify(end) };
    }
  },
  getCurrentTime(format = "HH:MM AMPM", type = "12") {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let ampm = hours >= 12 ? "PM" : "AM";

    if (type == "12") {
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (format == "HH:MM") return `${hours}:${minutes}`;
    else if (format == "HH:MM:SS") return `${hours}:${minutes}:${seconds}`;
    else if (format == "HH:MM:SS AMPM")
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    else if (format == "HH:MM AMPM") return `${hours}:${minutes} ${ampm}`;
  },
  getCurrent_Week(type) {
    let curr = new Date();
    let first = curr.getDate() - curr.getDay();
    let last = first + 6;
    let start = new Date(curr.setDate(first));
    let end = new Date(curr.setDate(last));

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (type == "office-ride") {
      return { start: start, end: end };
    } else {
      return { start: JSON.stringify(start), end: JSON.stringify(end) };
    }
  },
  getCurrent_Month(type) {
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    let start = new Date(y, m, 1);
    let end = new Date(y, m + 1, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (type == "office-ride") {
      return { start: start, end: end };
    } else {
      return { start: JSON.stringify(start), end: JSON.stringify(end) };
    }
  },
  getCurrent_year(type) {
    let currentYear = new Date().getFullYear();
    let start = new Date(currentYear, 0, 1);
    let end = new Date(currentYear, 11, 31);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (type == "office-ride") {
      return { start: start, end: end };
    } else {
      return { start: JSON.stringify(start), end: JSON.stringify(end) };
    }
  },
  synchronousLoop(data, processData, done) {
    if (data.length > 0) {
      let loop = (data, i, processData, done) => {
        processData(data[i], i, () => {
          if (++i < data.length)
            setTimeout(() => loop(data, i, processData, done), 0);
          else {
            return done();
          }
        });
      };

      loop(data, 0, processData, done);
    } else return done();
  },
  isDateCompare: function (date1, date2, condition = ">=") {
    date1 = new Date(`${date1}T00:00:00`).getTime();
    date2 = new Date(`${date2}T00:00:00`).getTime();

    if (condition == ">=") return date1 >= date2;
    else if (condition == "<=") return date1 <= date2;
    else if (condition == ">") return date1 > date2;
    else if (condition == "<") return date1 < date2;
    else return date1 == date2;
  },
  getDaysBeforeDate(startdate, days = 1) {
    if (!startdate) startdate = new Date().getTime();

    let date = new Date(startdate);
    let y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();

    let start = new Date(y, m, d - days);
    let end = new Date(y, m, d);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return this._getLocalDate(start);
  },

  _getLocalDate(ms) {
    ms = ms || new Date().getTime();

    let data = new Date(ms);
    let yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const D = [yyyy, mm, dd].join("-");

    return D;
  },

  getLightBgFromColor(color, alpha = 0.5) {
    if (!color) return undefined;

    let { r, g, b } = this.hexToRgb(color);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  _getLocalFullDate(ms) {
    if (!ms) return "";

    let data = new Date(ms);
    let yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    let hours = data.getHours();
    let minutes = data.getMinutes();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const D = [yyyy, mm, dd].join("-") + "T" + `${hours}:${minutes}`;

    return D;
  },
  getLocalFullDateLabel(ms, seperator = "/") {
    ms = ms || new Date().getTime();

    let data = new Date(ms);
    let yyyy = data.getFullYear();
    let mm = data.getMonth() + 1;
    let dd = data.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    let hours = data.getHours();
    let minutes = data.getMinutes();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const D =
      `${hours}:${minutes}` + ", " + [dd, mm, yyyy].join(seperator || "-");

    return D;
  },
  processData(TableHeader, Tabledata) {
    let dataStruct = {};
    const csvData = [];

    for (let i = 0; i < Tabledata.length; i += 1) {
      for (let j = 0; j < TableHeader.length; j += 1) {
        const { label, id } = TableHeader[j];

        if (label.toLowerCase() != "id") {
          if (Array.isArray(Tabledata[i][id])) {
            dataStruct[label] = Tabledata[i][id].join(",");
          } else {
            let _numbers = [
              "tolls",
              "toll_cost",
              "distance",
              "diesels",
              "diesel_cost",
              "fare",
              "passenger_count",
              "duetopay",
              "amount_to_pay",
              "diesel_deduction",
              "toll_amount",
              "escort",
              "escort_amount",
              "distance",
            ];

            let getNumber = (value) => {
              if (_numbers.includes(id))
                return isNaN(Number(Tabledata[i][id]))
                  ? 0
                  : parseFloat(Number(Tabledata[i][id]).toFixed(2));
              else return String(value || "");
            };

            dataStruct[label] = getNumber(Tabledata[i][id]);
          }
        }
      }
      csvData.push(dataStruct);
      dataStruct = {};
    }
    return csvData;
  },

  isObject: function (obj) {
    if (obj.constructor === Object && Object.keys(obj).length > 0) {
      return true;
    } else {
      return false;
    }
  },

  hexToRgb: function (hex) {
    if (!hex) return undefined;

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  },

  componentToHex: function (c) {
    let hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
  },

  rgbToHex: function (r, g, b) {
    return (
      "#" +
      utils.componentToHex(r) +
      utils.componentToHex(g) +
      utils.componentToHex(b)
    );
  },
  getUniqueId: function () {
    return String(uuidv4());
  },
  searchInArray: (searhVal, array, column) => {
    const matches = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i][column].toLowerCase().includes(searhVal.toLowerCase())) {
        matches.push(array[i]);
      }
    }

    return matches;
  },
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  },

  getFileExtension: function (url) {
    return url.split(".").pop().split(/\#|\?/)[0];
  },
  getFileSizeFromBytes(bytes) {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) return "0 Byte";

    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  },
  async urlToFile(url, filename) {
    const response = await fetch(url);
    const mimeType = response.headers.get("content-type");
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  },

  async getAddress(lat, lon) {
    return "Vimanapura, Sudhama Nagar, Bengaluru Central City Corporation, Bengaluru, Bangalore East, Bengaluru Urban, Karnataka, 560075, India"

    // const res = await fetch(
    //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    // );
    // const data = await res.json();
    // console.log(data, 'data');

    // return data.display_name;
  },

  async addImageGeoData(files) {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const lat = pos.coords.latitude.toFixed(4);
    const lon = pos.coords.longitude.toFixed(4);
    const address = await this.getAddress(lat, lon);
    let current_time = new Date().toLocaleString()
    let max_content_percent = 0.9;
    let overlay_texts = [
      {
        text: address,
        color: '#fff'
      },
      {
        text: `Lat: ${lat} | Lon: ${lon}`,
        color: '#fff'
      },
      {
        text: current_time,
        color: "#ffd900ff",
      }
    ]

    function getlines(ctx, text, maxWidth) {
      let lines = []

      const words = text.split(" ");
      let line = "";

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          lines.push(line)
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }


      lines.push(line)

      return lines
    }


    const processFile = async (file) => {
      // Wrap geolocation in a Promise

      const img = new Image();
      img.src = URL.createObjectURL(file);
      // img.width = 500

      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);


          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Overlay background for text
          const overlayHeight = 200

          ctx.fillStyle = "rgba(0,0,0,0.7)";
          ctx.fillRect(
            0,
            img.height - overlayHeight,
            img.width,
            overlayHeight
          );

          // Add text (address, lat/lon, time)
          ctx.fillStyle = "#fff";
          ctx.font = "24px Inter, sans-serif";

          ctx.textAlign = "center";
          ctx.textRendering = 'optimizeLegibility';

          let y_offset = (img.height - overlayHeight) + 30;
          let x_center = img.width / 2


          let max_content = img.width * max_content_percent

          overlay_texts.forEach(item => {
            let lines = getlines(ctx, item.text, max_content);

            ctx.fillStyle = item.color;

            lines.forEach((line) => {
              ctx.fillText(line, x_center, y_offset);
              y_offset += 50;
            })

          })


          // Convert canvas back to File
          canvas.toBlob((blob) => {
            if (blob) {
              const updatedFile = new File([blob], file.name, {
                type: file.type || "image/jpeg",
              });
              resolve(updatedFile);
            } else {
              resolve(file);
            }
          }, "image/jpeg");
        };
      });
    };

    // Process all files in parallel
    const updatedFiles = await Promise.all([...files].map(processFile));
    return updatedFiles;
  },

  generateInitialsImage(name, config = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Configuration with defaults
    const {
      width = 200,
      height = 200,
      backgroundColor = "#3498db",
      fontSize = 60,
      fontColor = "#ffffff",
      fontFamily = "Arial",
    } = config;

    canvas.width = width;
    canvas.height = height;

    // Extract initials
    const words = name.trim().split(" ");
    let initials = "";
    if (words.length >= 2) {
      initials = words[0][0] + words[words.length - 1][0];
    } else if (words.length === 1) {
      initials = words[0][0];
    }
    initials = initials.toUpperCase();

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw text
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, width / 2, height / 2);

    // Return image as Data URL
    return canvas.toDataURL("image/png");
  },

  getRandomColor() {
    var letters = "0123456789ABCDEF",
      color = "#";

    for (var i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];

    return color;
  },
  getNameInitials(name) {
    if (!name) return "";

    let initials = name.match(/\b\w/g) || [];

    initials = (
      (initials.shift() || "") + (initials.pop() || "")
    ).toUpperCase();

    return initials;
  },

  minToTimeInDays: (minutes) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let date = new Date();
    date.setDate(date.getDate() + parseInt(minutes / 60 / 24));
    return `${parseInt(minutes / 60 / 24)
      ? date.getDate() +
      "-" +
      months[date.getMonth()] +
      "-" +
      date.getFullYear() +
      " "
      : ""
      }${(
        "0" +
        (parseInt(minutes / 60) - parseInt(minutes / 60 / 24) * 24)
      ).slice(-2)}:${(
        "0" + parseInt(minutes - parseInt(minutes / 60) * 60)
      ).slice(-2)}`;
  },
  startDateAndMinToTimeInDays: (startDate, minutes) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let date = new Date(startDate);
    date.setDate(date.getDate() + parseInt(minutes / 60 / 24));
    return `${parseInt(minutes / 60 / 24)
      ? date.getDate() +
      "-" +
      months[date.getMonth()] +
      "-" +
      date.getFullYear() +
      " "
      : ""
      }${(
        "0" +
        (parseInt(minutes / 60) - parseInt(minutes / 60 / 24) * 24)
      ).slice(-2)}:${(
        "0" + parseInt(minutes - parseInt(minutes / 60) * 60)
      ).slice(-2)}`;
  },
  minToHrs: (minutes) => {
    return `${("0" + parseInt(minutes / 60)).slice(-2)}:${(
      "0" + parseInt(minutes - parseInt(minutes / 60) * 60)
    ).slice(-2)}`;
  },
  minToHrsWithLabel: (minutes) => {
    // console.log(minutes,(minutes / 60) - parseInt(minutes / 60 / 24))
    return (
      (parseInt(minutes / 60 / 24)
        ? `${parseInt(minutes / 60 / 24)} ` +
        ((parseInt(minutes / 60 / 24) > 1
          ? '<span style="color:#707174">days</span>'
          : '<span style="color:#707174">day</span>') +
          ` `)
        : "") +
      ((minutes / 60) % 24 >= 1
        ? parseInt(minutes - parseInt(minutes / 60) * 60)
          ? `${(
            "0" + parseInt(minutes / 60 - parseInt(minutes / 60 / 24) * 24)
          ).slice(-2)} ` +
          (parseInt((minutes / 60) % 24) > 1
            ? '<span style="color:#707174">hours</span>'
            : '<span style="color:#707174">hour</span>') +
          ` : `
          : `${(
            "0" + parseInt(minutes / 60 - parseInt(minutes / 60 / 24) * 24)
          ).slice(-2)} ` +
          (parseInt((minutes / 60) % 24) > 1
            ? '<span style="color:#707174">hours</span>'
            : '<span style="color:#707174">hour</span>')
        : "") +
      (parseInt(minutes - parseInt(minutes / 60) * 60)
        ? `${("0" + parseInt(minutes - parseInt(minutes / 60) * 60)).slice(
          -2
        )} ` +
        (parseInt(minutes - parseInt(minutes / 60) * 60) > 1
          ? '<span style="color:#707174">minutes</span>'
          : '<span style="color:#707174">minute</span>')
        : "")
    );
  },
  minToHrsWithHrsMinLabel: (minutes) => {
    return (
      (parseInt(minutes / 60)
        ? parseInt(minutes - parseInt(minutes / 60) * 60)
          ? `${("0" + parseInt(minutes / 60)).slice(-2)} ` +
          (parseInt(minutes / 60) > 1
            ? '<span style="color:#707174">hours</span>'
            : '<span style="color:#707174">hour</span>') +
          ` : `
          : `${("0" + parseInt(minutes / 60)).slice(-2)} ` +
          (parseInt(minutes / 60) > 1
            ? '<span style="color:#707174">hours</span>'
            : '<span style="color:#707174">hour</span>')
        : "") +
      (parseInt(minutes - parseInt(minutes / 60) * 60)
        ? `${("0" + parseInt(minutes - parseInt(minutes / 60) * 60)).slice(
          -2
        )} ` +
        (parseInt(minutes - parseInt(minutes / 60) * 60) > 1
          ? '<span style="color:#707174">minutes</span>'
          : '<span style="color:#707174">minute</span>')
        : "")
    );
  },


  async urlToFile(url, filename = 'image.jpg', mimeType = 'image/jpeg') {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }
};
export default utils;
