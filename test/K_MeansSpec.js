var K_Means = require('../K_Means');
var assert = require('assert');
var mathjs = require('mathjs');
var sinon = require('sinon');


describe('K_Means', function() {

    var callback_data;

    var callback = function(data) {
        data.clusters;
        console.log(data);
    };

    it("Should throw an exception if constructor parameters are not correctly set. ", function() {
        var options = [4, 5, 10000, callback, 10];
        var error = undefined;
        var random_Val = Math.floor(Math.random() * 4);
        options[random_Val] = undefined; //randomly setting one of the parameters to undefined.
        try {
            new K_Means({
                random_Init_Count: options[0],
                cluster_count: options[1],
                max_iterations: options[2],
                iteration_callback: options[3],
                notify_count: options[4]
            });
        } catch (err) {
            error = err;
        }
        assert.equal(error.name === "InvalidParam" && error.message === "The required constructor parameters cannot be empty.", true);
    });

    describe("While clustering centroids.", function() {
        var data = [];
        var data_generate = function() {
            var i = 0,
                j = 0;
            for (i = 0; i < 10000; i++) {
                data[i] = [];
                for (j = 0; j < 5; j++) {
                    data[i].push(Math.random() * 10 + j);
                }
            }
        };

        data_generate();

        var KMeans = new K_Means({
            random_Init_Count: 4,
            cluster_count: 7,
            max_iterations: 10000,
            iteration_callback: callback,
            notify_count: 10
        });


        var spy1 = sinon.spy(KMeans, "initiate_Centroids"),
            spy2 = sinon.spy(KMeans, "assign_Clusters"),
            spy3 = sinon.spy(KMeans, "update_Centroids"),
            spy4 = sinon.spy(KMeans, "apply_Callback");
        spy1.withArgs(data);
        spy2.withArgs(data);

        KMeans.start_Clustering(data).then(function(return_Val) {

            it('Should return diagnostic information after completing clustering.', function(done) {

                var success = false;

                if (return_Val[0].hasOwnProperty('iteration') && return_Val[0].hasOwnProperty('clusters') && return_Val[0].hasOwnProperty('centroids') && return_Val[0].hasOwnProperty('clustering_complete')) {
                    if (return_Val[0]['clustering_complete'] === true)
                        success = true;
                }

                assert.equal(success, true);
                done();
            });

            it('Should call initiate_Centroids method.', function(done) {
                var success = true;
                if (!spy1.called && spy1.callCount === 1)
                    success = false;
                spy1.restore();
                assert.equal(success, true);
                done();

            });

            it('Should call assign_Clusters method.', function(done) {
                var success = true;
                if (!spy2.called && spy2.callCount === return_Val[0].iteration)
                    success = false;
                spy2.restore();
                assert.equal(success, true);
                done();
            });

            it('Should call update_Centroids method.', function(done) {
                var success = true;
                if (!spy3.called && spy3.callCount === return_Val[0].iteration)
                    success = false;
                spy3.restore();
                assert.equal(success, true);
                done();
            });

            it('Should apply callback function.', function(done) {
                var success = true;
                if (!spy4.called && spy4.callCount === (return_Val[0].iteration / 10))
                    success = false;
                spy4.restore();
                assert.equal(success, true);
                done();
            });

        });


        describe("While initiating centroids.", function() {


            it('Should produce unique random number.', function() {
                var hmp = {},
                    stub = 0,
                    val = true;
                for (var i = 0; i < 10; i++) {
                    var rndv = KMeans.unique_Random_Val(mathjs.matrix(data));
                    if (hmp[rndv] === true) {
                        val = false;
                        break;
                    } else {
                        hmp[rndv] = true;
                    }
                }
                assert.equal(val, true);
            });

            it('Should generate the correct number of centroids specified with the right dimension.', function() {
                var centroids = mathjs.matrix(KMeans.initiate_Centroids(mathjs.matrix(data)));
                var success = true;
                if (Number(centroids.size()[0]) !== 7 || Number(centroids.size()[1]) !== 5) {

                    success = false;
                }
                assert.equal(success, true);

            });


        });

        describe("While assigning clusters.", function() {

            var spy5 = sinon.spy(KMeans, "distance");

            it('Should create clusters with the right dimensions.', function() {
                var clusters = (KMeans.assign_Clusters(mathjs.matrix(data)));
                var success = true;
                if (Number(clusters.length) !== 7) {

                    success = false;
                }

                for (var i = 0; i < clusters.length; i++) {
                    if (Number(clusters[i].length) === 0) {

                        success = false;
                        break;
                    }
                }

                assert.equal(success, true);

            });

            it('Should call distance method.', function(done) {
                var success = true;
                if (!spy5.called)
                    success = false;
                spy5.restore();
                assert.equal(success, true);
                done();
            });

            it('Should return the distance matrix with the correct values and dimensions.', function() {

                var ref_difference = [];
                var u = 76.98;
                var success = true;
                var difference = [];
                var input = mathjs.matrix(data);
                var diff_square_sum = [];

                for (var i = 0; i < input.size()[0]; i++) {
                    diff_square_sum[i] = mathjs.sum(mathjs.square(mathjs.subtract(u, input._data[i]))); // ||u-X||^2  = (u1-X1)^2+....+(un-Xn)^2
                }

                difference = diff_square_sum;

                ref_difference = KMeans.distance(input, u);

                for (var j = 0; j < difference.length; j++) {
                    if (difference[j] !== ref_difference[j]) {
                        success = false;
                        break;
                    }
                }

                if (ref_difference.length !== difference.length) {
                    success = true;
                }

                assert.equal(success, true);
            });

        });

        describe("While updating centroids.", function() {
            it("Should return the updated centroids with the right dimensions.", function() {
                var success = true;
                var centroids = mathjs.matrix(KMeans.update_Centroids());
                if (centroids.size()[0] !== 7 && centroids.size()[1] !== 5) {
                    success = false;
                }

                assert.equal(success, true);
            });


        });

    });
});
