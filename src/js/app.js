App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON("../pets.json", function(data) {
      var petsRow = $("#petsRow");
      var petTemplate = $("#petTemplate");

      for (i = 0; i < data.length; i++) {
        petTemplate.find(".panel-title").text(data[i].name);
        petTemplate.find("img").attr("src", data[i].picture);
        petTemplate.find(".pet-breed").text(data[i].breed);
        petTemplate.find(".pet-age").text(data[i].age);
        petTemplate.find(".pet-location").text(data[i].location);
        petTemplate.find(".btn-adopt").attr("data-id", data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Tracking.json", function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TrackingArtifact = data;
      App.contracts.Tracking = TruffleContract(TrackingArtifact);

      // Set the provider for our contract
      App.contracts.Tracking.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on("click", ".btn-adopt", App.handleAdopt);
  },

  markTracked: function(sources, account) {
    var sourceInstance;

    App.contracts.Tracking.deployed()
      .then(function(instance) {
        sourceInstance = instance;

        return sourceInstance.getSources.call();
      })
      .then(function(sources) {
        for (i = 0; i < sources.length; i++) {
          if (sources[i] !== "0x0000000000000000000000000000000000000000") {
            $(".panel-pet")
              .eq(i)
              .find("button")
              .text("Success")
              .attr("disabled", true);
          }
        }
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  handleTrack: function(event) {
    event.preventDefault();

    var seedId = parseInt($(event.target).data("id"));

    var sourceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Tracking.deployed()
        .then(function(instance) {
          sourceInstance = instance;

          // Execute adopt as a transaction by sending account
          return sourceInstance.adopt(seedId, { from: account });
        })
        .then(function(result) {
          return App.markTracked();
        })
        .catch(function(err) {
          console.log(err.message);
        });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
