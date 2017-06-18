<?php
if ($a != 1){ exit(); }
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<link rel="apple-touch-icon" sizes="76x76" href="assets/img/favicon.ico">

	<title>OSA Graduation Banquet 2017 - Admin Panel</title>

	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />

	<!--     Fonts and icons     -->
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" />

	<!-- CSS Files -->
	<link href="assets/css/styles.css" rel="stylesheet" />

</head>

<body>

	    <!--   Big container   -->
	    <div class="container" id="admin-app">
	        <div class="row">
		        <div class="col-sm-10 col-sm-offset-1">
                    <h2>Reservations by Table</h2>

					<div v-for="table in tables">
					<h2>Table {{ table.id }}</h2>
					<table class="table table-striped table-bordered">
                        <thead>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </thead>

                        <tbody> 
                            <tr v-for="seat in table.seats">
								<td>Seat {{ seat.id }}</td>
								<td v-bind:class="{'empty-cell':seat.firstname==''}">{{ seat.firstname }}</td>
								<td v-bind:class="{'empty-cell':seat.lastname==''}">{{ seat.lastname }}</td>
                            </tr>
                        </tbody>
                    </table>
					</div>








                    <!--<div id="seat-map-admin"></div>-->

                    <!--<table class="table table-striped table-bordered">
                        <thead>
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>Preferred Name</th>
                            <th>Guests</th>
                            <th>Seats</th>
							<th>Action</th>
                        </thead>

                        <tbody> 
                            <tr v-for="reservation in reservations">
                                <td>{{ reservation.firstname }}</td>
                                <td>{{ reservation.lastname }}</td>
                                <td>{{ reservation.preferred }}</td>
                                <td>{{ reservation.guests }}</td>
                                <td>{{ reservation.seats }}</td>
								<td><button class="btn btn-small btn-danger" @click="deleteEntry(reservation)">Delete Entry</button></td>
                            </tr>
                        </tbody>
                    </table>-->
		        </div>
            </div>
        </div>

        <!-- Success Modal -->
		<div class="modal fade" id="adminInfoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" aria-label="Close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">Seat Information</h4>
				</div>
				<div class="modal-body">
					<div class="text-center">
						<h2>Reserved by: <span id="s-firstname"></span>&nbsp;<span id="s-lastname"></span></h2>
					</div>

				</div>
			</div>
		</div>
		</div>
		               
</body>
	<script src="assets/js/vendor.js"></script>
	<script src="assets/js/admin.js"></script>
</html>