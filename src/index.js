(function () {
	"use strict";

	angular.module("app", ["ngMaterial", 'ngMessages'])
		.controller("AppController", function ($filter) {
			var self = this;
			this.inputs = {};
			this.results = [];
			var chunkIntoPiecesOfLength = 20;
			/*results structure schema
			this.results = [[
			 {
			 personNumber: 1,
			 questionNumbers: [2,5]
			 }
			 ],[
			 {
			 personNumber: 2,
			 questionNumbers: [1,3,4]
			 }
			 ]]*/

			this.submitForm = function () {
				//create array of numbers from 1 to x - all shuffled
				var questionNumbers = generateQuestionNumbers();
				//create array of objects with field personNumber from 1 tox - all shuffled
				var persons = createPersons();

				//every question number assign to the next person
				//if there is no other persons return to the beginning
				angular.forEach(questionNumbers, function (qNumber, qIndex) {
					persons[qIndex % persons.length].questionNumbers.push(qNumber);
				});

				//need to sort persons array to display in order
				var sortedPersons = $filter("orderBy")(persons, "personNumber");
				//need to chunk array of objects into array of arrays of objects
				//do it here, because angular filters don't cooperate with multi dimensional structures
				this.results = chunkResults(sortedPersons, chunkIntoPiecesOfLength);

				function generateQuestionNumbers() {
					var rawQuestionNumbers = createArrayFromRange(1, self.inputs.questionsNumber);
					return shuffleArray(rawQuestionNumbers);
				}

				function createPersons() {
					var rawPersonNumbers = createArrayFromRange(1, self.inputs.personsNumber);
					var personsArray = [];

					angular.forEach(rawPersonNumbers, function (personNumber) {
						personsArray.push({
							personNumber: personNumber,
							questionNumbers: []
						})
					});

					return shuffleArray(personsArray);
				}
			};

			function createArrayFromRange(start, end) {
				var startNumber = start < end ? start : end;
				var length = Math.abs(end - start) + 1;

				var newArray = [];

				for (var i = 0; i < length; i++) {
					newArray.push(startNumber + i);
				}

				return newArray;
			}

			function shuffleArray(array) {
				var m = array.length, t, i;

				// While there remain elements to shuffle…
				while (m) {

					// Pick a remaining element…
					i = Math.floor(Math.random() * m--);

					// And swap it with the current element.
					t = array[m];
					array[m] = array[i];
					array[i] = t;
				}

				return array;
			}

			function chunkResults(results, divideInto) {
				if (!angular.isArray(results)) {
					console.error("data is not an array");
					return results;
				}

				if (!angular.isNumber(divideInto)) {
					console.error("divideIn is not a number");
					return results;
				}

				var newArray = [];
				var tempInsideArray = [];

				for (var i = 0, len = results.length; i < len; i++) {
					tempInsideArray.push(results[i]);

					if (i % divideInto === divideInto - 1 || i === len - 1) {
						newArray.push(tempInsideArray);
						tempInsideArray = [];
					}
				}

				return newArray;
			}

			// (function mockInit() {
			// 	var tempResults = [];
			// 	for (var i = 0; i < 50; i++) {
			// 		tempResults.push({
			// 			personNumber: i + 1,
			// 			questionNumbers: [0, 1]
			// 		})
			// 	}
			//
			// 	self.results = chunkResults(tempResults, chunkIntoPiecesOfLength);
			//
			// })();
		});
})();