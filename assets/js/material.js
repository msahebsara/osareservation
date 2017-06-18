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






var app = new Vue({
    el: '#app',
    data: {
        db: '',
        ref: '',
        showModal: false,
        guests: [],
        firstname: '',
        lastname: '',
        preferred: '',
        seats: [],
        guestfirst: '',
        guestlast: '',
        firstpush: true,
        finalized: false,
        key: '',
        mappings: [],
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
        },

        openReservationModal: function (table) {
            this.mappings = [];
            var mainmapping = this.mappings;

            this.ref.on('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var child = childSnapshot.val();
                    if (child.seats) {
                        for (i = 0; i < child.seats.length; i++) {
                            if (child.seats[i].split('_')[0] == table) {
                                mainmapping.push(child.seats[i] + ": " + child.firstname + " " + child.lastname)
                            }
                        }
                    }
                });
            });

            $('#reservationModal').modal('show');
        },

        addSeat: function (seat) {
            var seat_label = seat.settings.id;
            this.seats.push(seat_label);
            this.updateEntry();
        },

        updateEntry: function () {
            var data = {
                firstname: this.firstname,
                lastname: this.lastname,
                preferred: this.preferred,
                guests: this.guests,
                seats: this.seats,
                finalized: this.finalized,
            }
            if (this.firstpush == true) {
                var getkey = this.ref.push(data);
                this.key = getkey.key;
                this.firstpush = false;
            } else {
                this.db.ref("new-reservations/" + this.key).update({
                    preferred: this.preferred,
                    guests: this.guests,
                    seats: this.seats,
                    finalized: this.finalized,
                });
            }
        },

        removeSeat: function (seat) {
            var seat_label = seat.settings.id;
            var index = this.seats.indexOf(seat_label);
            this.seats.splice(index, 1);

            this.updateEntry();

        },

        submitSeats: function () {
            if (this.allValid()) {
                this.finalized = true;
                this.updateEntry();
                this.showModal = false;
                this.guests = [];
                this.firstname = '';
                this.lastname = '';
                this.preferred = '';
                this.seats = [];
                this.guestfirst = '';
                this.guestlast = '';
                $('#successModal').modal('show');
                this.moveNavBack();

            }
        },

        showImageModal: function () {
            $('#imageModal').modal('show');
        },

        allValid: function () {
            if (this.seats.length < (this.guests.length + 1)) {
                alert('You have not assigned seats for you and all your guests!')
                return false;
            }
            return true;
        },

        mouseOver: function () {
            //$('.image-seating').css({height: '+=10%', width: '+=10%'});
        },

        toggleModal: function () {
            if (this.showModal == false) {
                $('#myModal').modal('show');
            } else {
                $('#myModal').modal('hide');

            }

            this.showModal = !this.showModal;
        },

        removeGuest: function (index) {
            this.guests.splice(index, 1);
        },

        addGuest: function (first, last) {

            this.guests.push({
                "firstname": first,
                "lastname": last
            });
            this.guestfirst = "";
            this.guestlast = "";
            this.toggleModal();
        },

        moveNavBack: function () {
            $('.wizard-navigation').find('ul').find('.active').removeClass('active').find('a').attr('aria-expanded', false);
            $('.wizard-navigation').find('ul').children().first().addClass('active').find('a').attr('aria-exanded', true);
            var wiz = $('.wizard-card').bootstrapWizard();
            $('.moving-tab').html($('.wizard-navigation').find('ul').find('.active').find('a').html());

            refreshAnimation(wiz, 0);
            wiz.show(0);

            $('.tab-content').find('.active').removeClass('active');
            $('.tab-content').children().first().addClass('active');

            $('.wizard-footer').find('.btn-next').show().removeClass('disabled');
            $('.wizard-footer').find('.btn-finish').hide();
            $('.wizard-footer').find('.btn-previous').addClass('disabled');
        },

        getName: function () {
            if (this.preferred != "") {
                return this.preferred;
            }

            return this.firstname;
        },
    },
    mounted: function () {
        this.initFirebase();
    },
})




var searchVisible = 0;
var transparent = true;
var mobile_device = false;

var doc = $(document).ready(function () {


    var sc = $('#seat-map').seatCharts({


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
            node: $('#legend'),
            items: [
                ['a', 'available', 'Available'],
                ['a', 'unavailable', 'Taken'],
                // [ 'a', 'oselected',   'Another User Selected'],
                ['a', 'selected', 'Your Selection']
            ]
        },
        click: function () {

            if (this.status() == 'available') {
                // seat has been selected
                if (app.guests.length + 1 > app.seats.length) {
                    app.addSeat(this);
                    return 'selected';
                } else {
                    alert('If you require more seats, please add the corresponding guests first!');
                    return 'available';
                }
            } else if (this.status() == 'selected') {
                //seat has been vacated
                app.removeSeat(this);
                return 'available';
            } else if (this.status() == 'unavailable') {
                //seat has been already booked
                return 'unavailable';
            } else {
                return this.style();
            }

        },

    });

    app.ref.on('value', function (snapshot) {
        sc.find('unavailable').status('available');
        snapshot.forEach(function (childSnapshot) {
            var child = childSnapshot.val();
            if (child.seats) {
                if (childSnapshot.ref.key == app.key) {
                    for (i = 0; i < child.seats.length; i++) {
                        sc.get(child.seats[i]).status('selected');
                    }
                } else {
                    for (i = 0; i < child.seats.length; i++) {
                        sc.get(child.seats[i]).status('unavailable');
                    }
                }
            }
        });
    });

    $('div.seatCharts-row:not(:first)').each(function () {
        $(this).find('.seatCharts-cell:first').each(function (index) {
            var original = $(this);
            var tablenum = original.html();
            original.html('<a href="#" class="table-modal-link">' + tablenum + '</a>');
        });
    });

    $('.table-modal-link').on('click', function () {
        app.openReservationModal($(this).html());
    })


    $.material.init();

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
        rules: {
            firstname: {
                required: true,
                minlength: 3
            },
            lastname: {
                required: true,
                minlength: 2
            },
        },

        errorPlacement: function (error, element) {
            $(element).parent('div').addClass('has-error');
        }
    });

    // Wizard Initialization
    var wiz = $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            }
        },

        onInit: function (tab, navigation, index) {
            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            var $wizard = navigation.closest('.wizard-card');

            $first_li = navigation.find('li:first-child a').html();
            $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
            $('.wizard-card .wizard-navigation').append($moving_div);

            refreshAnimation($wizard, index);

            $('.moving-tab').css('transition', 'transform 0s');
        },

        onTabClick: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();

            if (!$valid) {
                return false;
            } else {
                return true;
            }
        },

        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead

            if ($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function () {
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if (!index == 0) {
                $(checkbox).css({
                    'opacity': '0',
                    'visibility': 'hidden',
                    'position': 'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity': '1',
                    'visibility': 'visible'
                });
            }

            refreshAnimation($wizard, index);
        }
    });

    $('[data-toggle="wizard-radio"]').click(function () {
        wizard = $(this).closest('.wizard-card');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked', 'true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});



function refreshAnimation($wizard, index) {
    $total = $wizard.find('.nav li').length;
    $li_width = 100 / $total;

    total_steps = $wizard.find('.nav li').length;
    move_distance = $wizard.width() / total_steps;
    index_temp = index;
    vertical_level = 0;

    mobile_device = $(document).width() < 600 && $total > 3;

    if (mobile_device) {
        move_distance = $wizard.width() / 2;
        index_temp = index % 2;
        $li_width = 50;
    }

    $wizard.find('.nav li').css('width', $li_width + '%');

    step_width = move_distance;
    move_distance = move_distance * index_temp;

    $current = index + 1;

    if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
        move_distance -= 8;
    } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
        move_distance += 8;
    }

    if (mobile_device) {
        vertical_level = parseInt(index / 2);
        vertical_level = vertical_level * 38;
    }

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

    });
}

materialDesign = {

    checkScrollForTransparentNavbar: debounce(function () {
        if ($(document).scrollTop() > 260) {
            if (transparent) {
                transparent = false;
                $('.navbar-color-on-scroll').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar-color-on-scroll').addClass('navbar-transparent');
            }
        }
    }, 17)

}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};


