(function () {
  "use strict";

  const ABC = {
    version: "ABC-1.0",

    now() {
      return new Date();
    },

    todayKey() {
      const d = this.now();
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0")
      ].join("-");
    },

    getData() {
      try {
        return JSON.parse(localStorage.getItem("rahhesab_v2") || "{}");
      } catch {
        return {};
      }
    },

    getDays() {
      const data = this.getData();
      return data.days || {};
    },

    day(key) {
      return this.getDays()[key] || {
        income: 0,
        fuel: 0,
        wear: 0,
        other: 0,
        trips: 0,
        hours: 0,
        km: 0
      };
    },

    expenses(d) {
      return Number(d.fuel || 0) +
             Number(d.wear || 0) +
             Number(d.other || 0);
    },

    report(from, to) {
      const days = this.getDays();
      let income = 0;
      let expense = 0;
      let fuel = 0;
      let wear = 0;
      let other = 0;
      let trips = 0;
      let hours = 0;
      let km = 0;
      let count = 0;

      Object.entries(days).forEach(([key, d]) => {
        if (from && key < from) return;
        if (to && key > to) return;

        count++;
        income += Number(d.income || 0);
        fuel += Number(d.fuel || 0);
        wear += Number(d.wear || 0);
        other += Number(d.other || 0);
        trips += Number(d.trips || 0);
        hours += Number(d.hours || 0);
        km += Number(d.km || 0);
      });

      expense = fuel + wear + other;

      return {
        days: count,
        income,
        expense,
        fuel,
        wear,
        other,
        profit: income - expense,
        trips,
        hours,
        km,
        averageIncome: count ? income / count : 0,
        averageProfit: count ? (income - expense) / count : 0,
        profitPerKm: km ? (income - expense) / km : 0,
        profitPerTrip: trips ? (income - expense) / trips : 0
      };
    },

    week() {
      const d = this.now();
      const end = this.key(d);
      const startDate = new Date(d);
      startDate.setDate(d.getDate() - 6);
      return this.report(this.key(startDate), end);
    },

    month() {
      const d = this.now();
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      return this.report(this.key(start), this.key(d));
    },

    key(d) {
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0")
      ].join("-");
    },

    clock() {
      const el = document.getElementById("abcLiveClock");
      if (!el) return;

      const d = this.now();

      const time = d.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const date = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(d);

      el.innerHTML = `<b>${time}</b><small>${date}</small>`;
    },

    startClock() {
      this.clock();
      setInterval(() => this.clock(), 1000);
    },

    show(section) {
      const el = document.getElementById("abcPanel");
      if (!el) return;

      el.querySelectorAll(".abc-section").forEach(x => {
        x.style.display = "none";
      });

      const target = el.querySelector(`[data-abc="${section}"]`);
      if (target) target.style.display = "block";

      el.style.display = "block";
    },

    close() {
      const el = document.getElementById("abcPanel");
      if (el) el.style.display = "none";
    }
  };

  window.RahHesabABC = ABC;

  document.addEventListener("DOMContentLoaded", () => {
    ABC.startClock();
  });
})();
