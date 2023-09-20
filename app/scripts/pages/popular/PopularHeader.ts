export default class PopularHeader extends HTMLElement {
    form: HTMLFormElement | null;
    filterButton: HTMLButtonElement | null;
    startDateInput: HTMLInputElement | null;
    endDateInput: HTMLInputElement | null;
    detailRegion: HTMLInputElement | null;
    subRegion: HTMLInputElement | null;
    detailSubject: HTMLInputElement | null;
    subSubject: HTMLInputElement | null;

    constructor() {
        super();

        this.form = this.querySelector("form");
        this.filterButton = this.querySelector(".filterButton");
        this.startDateInput = this.querySelector("input[name='startDate']");
        this.endDateInput = this.querySelector("input[name='endDate']");
        this.detailRegion = this.querySelector("[name='detailRegion']");
        this.subRegion = this.querySelector(".subRegion");
        this.detailSubject = this.querySelector("[name='detailSubject']");
        this.subSubject = this.querySelector(".subSubject");
    }

    connectedCallback() {
        if (!this.form) return;

        this.initialLoanDuration();

        this.filterButton?.addEventListener("click", this.onClickFilterButton);

        this.form.addEventListener("change", this.onChange);

        this.form.addEventListener("reset", this.onReset);

        this.form.addEventListener("submit", this.onSumbit);
    }

    disconnectedCallback() {
        if (!this.form) return;

        this.filterButton?.removeEventListener(
            "click",
            this.onClickFilterButton
        );

        this.form.removeEventListener("change", this.onChange);

        this.form.removeEventListener("reset", this.onReset);

        this.form.removeEventListener("submit", this.onSumbit);
    }

    onClickFilterButton = () => {
        if (!this.form) return;
        this.form.hidden = !this.form.hidden;
    };

    onChange = (event: Event) => {
        const target = event.target as HTMLInputElement;

        switch (target.name) {
            case "loanDuration":
                this.handleLoanDuration(event);
                break;
            case "gender":
                this.handleGender(target);
                break;
            case "age":
                this.handleAge(target);
                break;
            case "region":
                this.handleRegion(target);
                break;
            case "detailRegion":
                this.handleDetailRegion(target);
                break;
            case "addCode":
                this.handleAddCode(target);
                break;
            case "subject":
                this.handleSubject(target);
                break;
            case "detailSubject":
                this.handleDetailSubject(target);
                break;
        }
    };

    handleGender(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const elA = this.querySelector(
                "input[name='gender'][value='A']"
            ) as HTMLInputElement;

            elA.checked = false;
        }

        if (target.value === "A") {
            const els = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='gender']"
            );

            els.forEach((item) => (item.checked = false));
        }
    }

    handleAge(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const elA = this.querySelector(
                "input[name='age'][value='A']"
            ) as HTMLInputElement;

            elA.checked = false;
        }

        if (target.value === "A") {
            const els = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='age']"
            );

            els.forEach((item) => (item.checked = false));
        }
    }

    handleRegion(target: HTMLInputElement) {
        const elA = this.querySelector(
            "input[name='region'][value='A']"
        ) as HTMLInputElement;

        const els = this.querySelectorAll<HTMLInputElement>(
            "input[type='checkbox'][name='region']"
        );

        if (!(target.value === "A")) {
            elA.checked = false;
        }

        if (target.value === "A") {
            els.forEach((item) => (item.checked = false));
        }

        const checkedEls = Array.from(
            this.querySelectorAll<HTMLInputElement>('[name="region"]:checked')
        ).filter((el) => el.value !== "A");

        if (this.detailRegion && this.subRegion) {
            const isOnly = checkedEls.length === 1;
            this.detailRegion.disabled = !isOnly;
            if (this.detailRegion.checked) {
                this.subRegion.hidden = !isOnly;
            }
        }
    }

    handleDetailRegion(target: HTMLInputElement) {
        if (!this.subRegion) return;
        this.subRegion.hidden = !target.checked;
    }

    handleAddCode(target: HTMLInputElement) {
        if (!(target.value === "A")) {
            const elA = this.querySelector(
                "input[name='addCode'][value='A']"
            ) as HTMLInputElement;

            elA.checked = false;
        }

        if (target.value === "A") {
            const els = this.querySelectorAll<HTMLInputElement>(
                "input[type='checkbox'][name='addCode']"
            );

            els.forEach((item) => (item.checked = false));
        }
    }

    handleSubject(target: HTMLInputElement) {
        const elA = this.querySelector(
            "input[name='subject'][value='A']"
        ) as HTMLInputElement;

        const els = this.querySelectorAll<HTMLInputElement>(
            "input[type='checkbox'][name='subject']"
        );

        if (!(target.value === "A")) {
            elA.checked = false;
        }

        if (target.value === "A") {
            els.forEach((item) => (item.checked = false));
        }

        const checkedEls = Array.from(
            this.querySelectorAll<HTMLInputElement>('[name="subject"]:checked')
        ).filter((el) => el.value !== "A");

        if (this.detailSubject && this.subSubject) {
            const isOnly = checkedEls.length === 1;
            this.detailSubject.disabled = !isOnly;
            if (this.detailSubject.checked) {
                this.subSubject.hidden = !isOnly;
            }
        }
    }

    handleDetailSubject(target: HTMLInputElement) {
        if (!this.subSubject) return;
        this.subSubject.hidden = !target.checked;
    }

    handleLoanDuration(event?: Event) {
        if (!this.startDateInput || !this.endDateInput) {
            return;
        }

        const { currentDate, currentYear, currentMonth, currentDay } =
            this.getCurrentDates();

        const target = event?.target as HTMLInputElement;

        switch (target?.value) {
            case "year":
                this.initialLoanDuration();
                break;
            case "month": {
                this.startDateInput.value = `${currentYear}-${currentMonth}-01`;
                this.endDateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
                break;
            }
            case "week": {
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(
                    currentDate.getDate() - currentDate.getDay()
                );
                const startWeekYear = startOfWeek.getFullYear();
                const startWeekMonth = String(
                    startOfWeek.getMonth() + 1
                ).padStart(2, "0");
                const startWeekDay = String(startOfWeek.getDate()).padStart(
                    2,
                    "0"
                );
                this.startDateInput.value = `${startWeekYear}-${startWeekMonth}-${startWeekDay}`;
                this.endDateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
                break;
            }
            case "custom":
                break;
        }

        this.querySelector(".dateRange")?.addEventListener("click", () => {
            const customDateInput = this.querySelector(
                "input[name='loanDuration'][value='custom']"
            ) as HTMLInputElement;
            customDateInput.checked = true;
        });
    }

    getCurrentDates() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(
            2,
            "0"
        );
        const currentDay = String(currentDate.getDate()).padStart(2, "0");

        return {
            currentDate,
            currentYear,
            currentMonth,
            currentDay,
        };
    }

    initialLoanDuration() {
        if (!this.startDateInput || !this.endDateInput) return;

        const { currentDate, currentMonth, currentDay } =
            this.getCurrentDates();

        this.startDateInput.value = `${currentDate.getFullYear()}-01-01`;
        this.endDateInput.value = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;
    }

    onReset = () => {
        setTimeout(() => {
            this.initialLoanDuration();
        }, 100);
    };

    onSumbit = (event: Event) => {
        event.preventDefault();
        if (!this.form) return;

        const formData = new FormData(this.form);

        for (const pair of (formData as any).entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
    };
}