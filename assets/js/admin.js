var columns = 10;
var rows = 52;

function convertToNumberingScheme(number) {
    var baseChar = ("A").charCodeAt(0),
        letters = "";

    do {
        number -= 1;
        letters = String.fromCharCode(baseChar + (number % 26)) + letters;
        number = (number / 26) >> 0;
    } while (number > 0);
    return letters;
}

var alphatizedCount = [];

for (i = 1; i < columns + 1; i++) {
    alphatizedCount.push(convertToNumberingScheme(i));
}

var titledCount = [];

for (i = 0; i < rows; i++) {
    titledCount.push("Table " + (i + 1) * 1);
}


function generateMap(columns, rows) {
    var strColumn = Array(columns + 1).join("a");
    var map = [];
    for (i = 0; i < rows; i++) {
        map.push(strColumn);
    }
    return map;
}





var adminapp = new Vue({
    el: '#admin-app',
    data: {
        db: '',
        ref: '',
        reservations: [],
        columns: '',
        tables: [],
    },
    methods: {
        initFirebase: function () {
            // Initialize Firebase
            var config = {
                apiKey: "",
                authDomain: "",
                databaseURL: "",
                projectId: "",
                storageBucket: "",
                messagingSenderId: ""
            };
            firebase.initializeApp(config);

            this.db = firebase.database();
            this.ref = this.db.ref('new-reservations');

            this.db.ref('new-reservations').once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var child = childSnapshot.val();
                    console.log(child);
                    adminapp.reservations.push(child);
                });
            }).then(function () {
                adminapp.createTableMappings();
            });

        },

        createTableMappings: function () {
            for (i = 1; i <= 52; i++) {
                var seats = [];
                for (j = 1; j <= 10; j++) {
                    seats.push({
                        id: j,
                        firstname: '',
                        lastname: '',
                    })
                }
                this.tables.push({
                    id: i,
                    seats: seats,
                })
            }

            var main = this;
            for (x = 0; x < main.reservations.length; x++) {
                if (main.reservations[x].seats) {
                    for (z = 0; z < main.reservations[x].seats.length; z++) {
                        var tableIndex = main.reservations[x].seats[z].split("_")[0].split(" ")[1] - 1 * 1;
                        var seatIndex = main.reservations[x].seats[z].split("_")[1].charCodeAt(0) - 65 * 1;
                        main.tables[tableIndex].seats[seatIndex].firstname = main.reservations[x].firstname;
                        main.tables[tableIndex].seats[seatIndex].lastname = main.reservations[x].lastname;
                    }
                }
            }


            console.log(this.tables);
        },


        showModal: function (type, seat) {
            if (type == "unavailable") {
                this.ref.on('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var child = childSnapshot.val();
                        if (child.seats) {
                            for (i = 0; i < child.seats.length; i++) {
                                if (child.seats[i] == seat.settings.id) {
                                    $('#adminInfoModal').find('#s-firstname').html(child.firstname);
                                    $('#adminInfoModal').find('#s-lastname').html(child.lastname);
                                    $('#adminInfoModal').modal('show');
                                }
                            }
                        }
                    });
                });
            } else {
                $('#adminInfoModal').find('#s-firstname').html('');
                $('#adminInfoModal').find('#s-lastname').html('');
                $('#adminInfoModal').modal('show');
            }

        },

        arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length)
                return false;
            for (var i = arr1.length; i--;) {
                if (arr1[i] !== arr2[i])
                    return false;
            }

            return true;
        },

        deleteEntry: function (reservation) {
            var main = this;
            console.log('attempting to remove...');
            this.ref.on('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var child = childSnapshot.val();
                    if (child.seats && reservation.seats) {
                        if (main.arraysEqual(reservation.seats, child.seats)) {
                            childSnapshot.ref.remove();
                            console.log('removed');
                            location.reload();
                        }
                    }
                });
            });

        }
    },
    computed: {
        classEmpty: function (firstname, lastname) {
            return {
                'highlight-row': firstname == "" && lastname == "",
            }
        }
    },
    mounted: function () {
        this.initFirebase();
    },
});



var doc = $(document).ready(function () {


    var adminsc = $('#seat-map-admin').seatCharts({

        map: generateMap(columns, rows),

        naming: {
            columns: alphatizedCount,
            rows: titledCount,
        },
        seats: {
            a: {
                price: 0,
                classes: 'default-seat',
                category: 'Default Class',
            }

        },
        legend: {
            node: $('#legend-admin'),
            items: [
                ['a', 'available', 'Available'],
                ['a', 'unavailable', 'Taken'],
                ['a', 'selected', 'Your Selection']
            ]
        },
        click: function () {

            if (this.status() == 'available') {
                adminapp.showModal('available', this);
                return 'available';

            } else if (this.status() == 'selected') {
                return 'available';
            } else if (this.status() == 'unavailable') {
                adminapp.showModal('unavailable', this);
                return 'unavailable';
            } else {
                return this.style();
            }

        },

    });

    adminapp.ref.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var child = childSnapshot.val();
            if (child.seats) {
                for (i = 0; i < child.seats.length; i++) {
                    adminsc.get(child.seats[i]).status('unavailable');
                }
            }
        });
    });




});