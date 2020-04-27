import React from "react";
import areaOfTriangle from "../component/areaOfTriangle.css";

export default class areaOfTriangleStraightLines extends React.Component {
  constructor() {
    super();
    this.map = null;
    this.homeToNearestPoint = null;
    this.nearestToFarthestPoint = null;
    this.farthestToNearestPoint = null;

    this.state = {
      areaOfTriangleOfStaright: null,
      timeTakenToCross: null,
      viewFlag: false,
    };
  }

  componentDidMount() {
    this.map = this.props.Map;
  }

  findArea = () => {
    let objects = this.map.getObjects();
    // Distance Between Point In Meter
    this.homeToNearestPoint = objects[0]
      .getGeometry()
      .distance(objects[1].getGeometry());
    this.nearestToFarthestPoint = objects[1]
      .getGeometry()
      .distance(objects[2].getGeometry());
    this.farthestToNearestPoint = objects[2]
      .getGeometry()
      .distance(objects[0].getGeometry());

    // Meter To Km
    this.homeToNearestPoint = Math.ceil(this.homeToNearestPoint / 1000);
    this.nearestToFarthestPoint = Math.ceil(this.nearestToFarthestPoint / 1000);
    this.farthestToNearestPoint = Math.ceil(this.farthestToNearestPoint / 1000);

    let distance =
      this.homeToNearestPoint +
      this.nearestToFarthestPoint +
      this.farthestToNearestPoint;

    let surface = distance / 2;
    let data =
      surface *
      ((surface - this.homeToNearestPoint) *
        (surface - this.nearestToFarthestPoint) *
        (surface - this.farthestToNearestPoint));

    this.setState({
      areaOfTriangleOfStaright: Math.sqrt(data).toFixed(2),
      timeTakenToCross: distance / 5,
      viewFlag: true,
    });
  };

  render() {
    return (
      <div className="grid">
        <button className="button" onClick={this.findArea}>
          Find Area Of Triangle
        </button>
        {this.state.viewFlag ? (
          <div>
            <span>
              Area Of Triangle : {this.state.areaOfTriangleOfStaright} Km
            </span>
            <br />
            <span>Time Taken To Walk : {this.state.timeTakenToCross} Hr</span>
            <br />
          </div>
        ) : null}
      </div>
    );
  }
}
