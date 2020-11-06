class Pagination {
    constructor(options) {
        console.log(options);
        this.id = options.id;
        this.element = document.getElementById(this.id);
        this.tableID = options.tableID;
        this.tableBody = document.querySelector("#" + this.tableID + " tbody");
        this.tableElement = document.getElementById(this.tableID);
        this.nextButton = this.element.getElementsByClassName('next')[0];
        this.prevButton = this.element.getElementsByClassName('previous')[0];
        this.paginationLabel = this.element.getElementsByClassName('pagination-label')[0];
        this.noOfRows = options.noOfRows;
        //this.value = 0;
        this.start = 1;
        this.end = this.noOfRows;
        this.init();
    }

    init() {
        this.collectingTableInfo();
        this.addEvents();

    }

    collectingTableInfo() {

        this.totalRows = document.querySelectorAll("#" + this.tableID + " tbody tr");
        this.totalNoOfRows = this.totalRows.length;

        if (this.totalNoOfRows <= this.noOfRows) {

            this.element.style.display = 'none';
        } else {
            this.showRows(this.totalRows, this.start, this.end);
        }
    }

    addEvents() {
        this.nextButton.addEventListener('click', () => this.onNext());
        this.prevButton.addEventListener('click', () => this.onPrevious());
    }

    onNext() {
        console.log('Next Button Clicked');
        this.start = this.end + 1;
        this.end = this.start + this.noOfRows - 1;

        if (this.end >= this.totalNoOfRows) {
            this.end = this.totalNoOfRows;
        }
        this.showRows(this.totalRows, this.start, this.end);
    }

    onPrevious() {
        console.log('Previous Button Clicked');
        if (this.start > 1) {
            this.start = this.start - this.noOfRows;
            this.end = this.start + this.noOfRows - 1;
        }

        this.showRows(this.totalRows, this.start, this.end);

    }

    showRows(rows, start, end) {
        console.log(rows);
        start = start - 1;
        end = end - 1;

        this.tableBody.innerHTML = "";

        for (let i = 0; i < rows.length; i++) {
            if (i >= start && i <= end) {
                this.tableBody.appendChild(rows[i]);
                //rows[i].style.display = 'block';
            } else {
                // rows[i].style.display = 'none';
            }
        }

        this.updatePagination();
    }

    updatePagination() {

        if (this.end == this.totalNoOfRows) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }

        if (this.start == 1) {
            this.prevButton.style.display = 'none';
        } else {
            this.prevButton.style.display = 'block';
        }

        this.paginationLabel.innerHTML = "Viewing <span>" + this.start + "-" + this.end + "</span> of <span>" + this.totalNoOfRows + "</span>";
    }
}