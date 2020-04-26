import React, { Component } from "react";
import constants from "../../src/constans.json";
import axios from "../../src/services/interceptor";
import AreaOfTriangle from "../../src/component/areaOfTriangle";
import _ from "lodash";

export default class Map extends Component {
  constructor() {
    super();
    this.platform = null;
    this.map = null;


    this.state = {
      apikey: constants.API_KEY.HERE_MAP,
      lat: 8.22357,
      lng: 77.352112,
      zoom: 8,
      restaurantList: [],
    };
  }

  componentDidMount() {
    // Getting Current Latitude and Longitude
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        if (position && position.coords) {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

        }
        this.drawMap();
      });
    } else {
      this.drawMap();
    }


  }


  drawMap() {

    this.platform = new window.H.service.Platform(this.state);
    var defaultLayers = this.platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    this.map = new window.H.Map(
      document.getElementById("map"),
      defaultLayers.raster.normal.map,
      {
        zoom: this.state.zoom,
        center: {
          lat: this.state.lat,
          lng: this.state.lng,
        },
      }
    );

    // For Interactive Maps
    var events = new window.H.mapevents.MapEvents(this.map);
    new window.H.mapevents.Behavior(events);

    this.getRestaurantDetails();
  }

  addMarkers() {
    if (this.state.restaurantList) {
      this.state.restaurantList.forEach((data) => {
        let latitude =
          data.latitude && data.latitude === "0.0000000000"
            ? this.state.lat + 0.5
            : parseFloat(data.latitude);
        let longitude =
          data.longitude && data.longitude === "0.0000000000"
            ? this.state.lng + 0.5
            : parseFloat(data.longitude);

        var marker = new window.H.map.Marker({
          lat: latitude,
          lng: longitude,
        });
        this.map.addObject(marker);
      });
    }

  }

  getRequiredRestaurant(listOfRestaurant) {
    let filteredResult = [];

    let CurrentState = {
      latitude: this.state.lat,
      longitude: this.state.lng,
    }
    filteredResult.push(CurrentState);



    // Getting Nearest
    let min = _.minBy(listOfRestaurant, function (data) {
      return (
        data.restaurant.location.latitude && data.restaurant.location.longitude
      );
    });

    filteredResult.push(min.restaurant.location);


    //Getting Farthest
    let max = _.maxBy(listOfRestaurant, function (data) {
      return (
        data.restaurant.location.latitude && data.restaurant.location.longitude
      );
    });

    filteredResult.push(max.restaurant.location);




    this.setState({
      restaurantList: filteredResult,
    });

    if (filteredResult.length) {
      this.addMarkers();
    }
  }

  // Getting NearBy Restaurant Details
  getRestaurantDetails() {
    let url =
      constants.BASE_URL +
      constants.END_POINTS.GET_RESTATRUANT_DETAILS +
      "?lat=" +
      this.state.lat +
      "&lon=" +
      this.state.lng;
    axios.get(url).then((res) => {
      if (
        res &&
        res.status === 200 &&
        res.data &&
        res.data.nearby_restaurants &&
        res.data.nearby_restaurants.length
      ) {
        let listOfRestaurant = res.data.nearby_restaurants;
        this.getRequiredRestaurant(listOfRestaurant);
      }
    });
  }

  render() {
    return (
      <div>
        <div
          id="map"
          style={{ width: "100%", height: "500px", background: "grey" }}
        />
        {this.map ? <AreaOfTriangle Map={this.map}></AreaOfTriangle> : null}
      </div>
    );
  }
}
