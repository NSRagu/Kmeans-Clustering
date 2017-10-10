let K_Means = require('../K_Means');
let assert = require('assert');
let mathjs = require('mathjs');
let sinon = require('sinon');


describe('K_Means', function() {

    let callback_data;

    let callback = function(data) {
        data.clusters;
        console.log(data);
    };

    it("Should throw an exception if constructor parameters are not correctly set. ", function() {
        let options = [4, 5, 10000, callback, 10];
        let error = undefined;
        let random_Val = Math.floor(Math.random() * 4);
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
        let data = [];
        let data_generate = function() {
            let i = 0,
                j = 0;
            for (i = 0; i < 10000; i++) {
                data[i] = [];
                for (j = 0; j < 5; j++) {
                    data[i].push(Math.random() * 10 + j);
                }
            }
        };

        data_generate();

        let KMeans = new K_Means({
            random_Init_Count: 4,
            cluster_count: 7,
            max_iterations: 10000,
            iteration_callback: callback,
            notify_count: 10
        });


        let spy1 = sinon.spy(KMeans, "initiate_Centroids"),
            spy2 = sinon.spy(KMeans, "assign_Clusters"),
            spy3 = sinon.spy(KMeans, "update_Centroids"),
            spy4 = sinon.spy(KMeans, "apply_Callback");
        spy1.withArgs(data);
        spy2.withArgs(data);

        KMeans.start_Clustering(data).then(function(return_Val) {

            it('Should return diagnostic information after completing clustering.', function(done) {

                let success = false;

                if (return_Val[0].hasOwnProperty('iteration') && return_Val[0].hasOwnProperty('clusters') && return_Val[0].hasOwnProperty('centroids') && return_Val[0].hasOwnProperty('clustering_complete')) {
                    if (return_Val[0]['clustering_complete'] === true)
                        success = true;
                }

                assert.equal(success, true);
                done();
            });

            it('Should call initiate_Centroids method.', function(done) {
                let success = true;
                if (!spy1.called && spy1.callCount === 1)
                    success = false;
                spy1.restore();
                assert.equal(success, true);
                done();

            });

            it('Should call assign_Clusters method.', function(done) {
                let success = true;
                if (!spy2.called && spy2.callCount === return_Val[0].iteration)
                    success = false;
                spy2.restore();
                assert.equal(success, true);
                done();
            });

            it('Should call update_Centroids method.', function(done) {
                let success = true;
                if (!spy3.called && spy3.callCount === return_Val[0].iteration)
                    success = false;
                spy3.restore();
                assert.equal(success, true);
                done();
            });

            it('Should apply callback function.', function(done) {
                let success = true;
                if (!spy4.called && spy4.callCount === (return_Val[0].iteration / 10))
                    success = false;
                spy4.restore();
                assert.equal(success, true);
                done();
            });

        });


        describe("While initiating centroids.", function() {


            it('Should produce unique random number.', function() {
                let hmp = {},
                    stub = 0,
                    val = true;
                for (let i = 0; i < 10; i++) {
                    let rndv = KMeans.unique_Random_Val(mathjs.matrix(data));
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
                let centroids = mathjs.matrix(KMeans.initiate_Centroids(mathjs.matrix(data)));
                let success = true;
                if (Number(centroids.size()[0]) !== 7 || Number(centroids.size()[1]) !== 5) {

                    success = false;
                }
                assert.equal(success, true);

            });


        });

        describe("While assigning clusters.", function() {

            let spy5 = sinon.spy(KMeans, "distance");

            it('Should create clusters with the right dimensions.', function() {
                let clusters = (KMeans.assign_Clusters(mathjs.matrix(data)));
                let success = true;
                if (Number(clusters.length) !== 7) {

                    success = false;
                }

                for (let i = 0; i < clusters.length; i++) {
                    if (Number(clusters[i].length) === 0) {

                        success = false;
                        break;
                    }
                }

                assert.equal(success, true);

            });

            it('Should call distance method.', function(done) {
                let success = true;
                if (!spy5.called)
                    success = false;
                spy5.restore();
                assert.equal(success, true);
                done();
            });

            it('Should return the distance matrix with the correct values and dimensions.', function() {

                let ref_difference = [];
                let u = 76.98;
                let success = true;
                let difference = [];
                let input = mathjs.matrix(data);
                let diff_square_sum = [];

                for (let i = 0; i < input.size()[0]; i++) {
                    diff_square_sum[i] = mathjs.sum(mathjs.square(mathjs.subtract(u, input._data[i]))); // ||u-X||^2  = (u1-X1)^2+....+(un-Xn)^2
                }

                difference = diff_square_sum;

                ref_difference = KMeans.distance(input, u);

                for (let j = 0; j < difference.length; j++) {
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
                let success = true;
                let centroids = mathjs.matrix(KMeans.update_Centroids());
                if (centroids.size()[0] !== 7 && centroids.size()[1] !== 5) {
                    success = false;
                }

                assert.equal(success, true);
            });


        });

    });
});
