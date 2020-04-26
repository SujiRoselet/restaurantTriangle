import React, { Component } from "react";
import constants from "../../src/constans.json";
import axios from "../../src/services/interceptor";
import AreaOfTriangleWithStraightEdge from "../../src/component/areaOfTriangleWithStraightEdge";
import AreaOfTriangleWithCurvedEdge from "../../src/component/areaOfTriangleWithCurvedEdge";
import areaOfTriangle from "../component/areaOfTriangle.css";
import _ from "lodash";

export default class Map extends Component {
  constructor() {
    super();
    this.platform = null;
    this.map = null;
    this.summary = null;

    this.state = {
      apikey: constants.API_KEY.HERE_MAP,
      lat: 8.22357,
      lng: 77.352112,
      zoom: 10,
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
    window.H.ui.UI.createDefault(this.map, defaultLayers);
    this.getRestaurantDetails();
  }

  //adding Custom Markers
  addMarkers() {
    if (this.state.restaurantList) {
      this.state.restaurantList.forEach((data) => {
        let latitude = parseFloat(data.latitude);
        let longitude = parseFloat(data.longitude);

        var svgMarkup =
          '<svg width="24" height="24" ' +
          'xmlns="http://www.w3.org/2000/svg">' +
          '<rect stroke="white" fill="#1ad1ff" x="1" y="1" width="22" ' +
          'height="22" /><text x="12" y="18" font-size="12pt" ' +
          'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
          'fill="white">' +
          data.label +
          "</text></svg>";

        // Create an icon, an object holding the latitude and longitude, and a marker:
        var icon = new window.H.map.Icon(svgMarkup),
          coords = { lat: latitude, lng: longitude },
          marker = new window.H.map.Marker(coords, { icon: icon });
        this.map.addObject(marker);
      });
    }
  }

  //Filtering Only Required Details
  getRequiredRestaurant(listOfRestaurant) {
    let filteredResult = [];

    let CurrentState = {
      latitude: this.state.lat,
      longitude: this.state.lng,
      label: "H",
    };

    filteredResult.push(CurrentState);

    // Getting Nearest
    let min = _.minBy(listOfRestaurant, function (data) {
      if (
        data.restaurant.location.latitude !== "0.0000000000" &&
        data.restaurant.location.longitude !== "0.0000000000"
      ) {
        return (
          data.restaurant.location.latitude &&
          data.restaurant.location.longitude
        );
      }
    });

    if (min) {
      min.restaurant.location.label = "N";
      filteredResult.push(min.restaurant.location);
    }

    //Getting Farthest
    let max = _.maxBy(listOfRestaurant, function (data) {
      if (
        data.restaurant.location.latitude !== "0.0000000000" &&
        data.restaurant.location.longitude !== "0.0000000000"
      ) {
        return (
          data.restaurant.location.latitude &&
          data.restaurant.location.longitude
        );
      }
    });

    if (max) {
      max.restaurant.location.label = "F";
      filteredResult.push(max.restaurant.location);
    }
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
        {this.map ? (
          <AreaOfTriangleWithStraightEdge
            Map={this.map}
          ></AreaOfTriangleWithStraightEdge>
        ) : null}
        {this.map ? (
          <AreaOfTriangleWithCurvedEdge
            Map={this.map}
            Platform={this.platform}
            restaurantList={this.state.restaurantList}
          ></AreaOfTriangleWithCurvedEdge>
        ) : null}
      </div>
    );
  }
}
