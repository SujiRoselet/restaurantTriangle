import React from "react";
import areaOfTriangle from "../component/areaOfTriangle.css";
import mTokm from "../../src/services/mTokm";

export default class areaOfTriangleWithCurvedEdge extends React.Component {
  constructor() {
    super();
    this.map = null;
    this.restaurantList = null;
    this.platform = null;

    this.state = {
      distance: null,
      timeTaken: null,
      viewFlag: false,
    };
  }

  componentDidMount() {
    this.map = this.props.Map;
    this.restaurantList = this.props.restaurantList;
    this.platform = this.props.Platform;
  }

  calculateRoute = () => {
    if (this.restaurantList) {
      var router = this.platform.getRoutingService(),
        routeRequestParams = {
          mode: "shortest;car",
          representation: "display",
          routeattributes: "waypoints,summary,shape,legs",
          maneuverattributes: "direction,action",
          waypoint0:
            this.restaurantList[0].latitude +
            "," +
            this.restaurantList[0].longitude,
          waypoint1:
            this.restaurantList[1].latitude +
            "," +
            this.restaurantList[1].longitude,
          waypoint2:
            this.restaurantList[2].latitude +
            "," +
            this.restaurantList[2].longitude,
          waypoint3:
            this.restaurantList[0].latitude +
            "," +
            this.restaurantList[0].longitude,
        };

      router.calculateRoute(routeRequestParams, this.onSuccess, this.onError);
    }
  };

  onError(error) {
    alert("Can't reach the remote server");
  }

  addRouteShapeToMap(route) {
    var lineString = new window.H.geo.LineString(),
      routeShape = route.shape,
      polyline;

    routeShape.forEach(function (point) {
      var parts = point.split(",");
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new window.H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: "rgba(0, 128, 255, 0.7)",
      },
    });
    // Add the polyline to the map
    this.map.addObject(polyline);
    // And zoom to its bounding rectangle
    this.map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox(),
    });
  }

  addSummaryToPanel(summary) {
    let standardWalkingSpeed = 5;
    let distance = mTokm(summary.distance);
    this.setState({
      distance: distance,
      timeTaken: distance / standardWalkingSpeed,
      viewFlag: true,
    });
  }

  onSuccess = (result) => {
    var route = result.response.route[0];
    this.addRouteShapeToMap(route);
    this.addSummaryToPanel(route.summary);
  };

  render() {
    return (
      <div className="grid">
        <button className="button" onClick={this.calculateRoute}>
          Find Area Of Triangle Whose Edges are Actual Car Driving Distance
        </button>
        {this.state.viewFlag ? (
          <div>
            <span>Distance Between the Points : {this.state.distance} Km</span>
            <br />
            <span>Time Taken To Walk : {this.state.timeTaken} Hr</span>
          </div>
        ) : null}
      </div>
    );
  }
}
