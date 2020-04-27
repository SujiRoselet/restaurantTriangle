import React from "react";
import areaOfTriangle from "../component/areaOfTriangle.css";
import mTokm from "../../src/services/mTokm";
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
    this.homeToNearestPoint = mTokm(this.homeToNearestPoint);
    this.nearestToFarthestPoint = mTokm(this.nearestToFarthestPoint);
    this.farthestToNearestPoint = mTokm(this.farthestToNearestPoint);

    let distance =
      this.homeToNearestPoint +
      this.nearestToFarthestPoint +
      this.farthestToNearestPoint;

    let semiperimeter = distance / 2;
    let data =
      semiperimeter *
      ((semiperimeter - this.homeToNearestPoint) *
        (semiperimeter - this.nearestToFarthestPoint) *
        (semiperimeter - this.farthestToNearestPoint));
    let standardWalkingSpeed = 5;

    this.setState({
      areaOfTriangleOfStaright: Math.sqrt(data).toFixed(2),
      timeTakenToCross: distance / standardWalkingSpeed,
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
