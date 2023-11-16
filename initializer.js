$(function () {
  // Grant CesiumJS access to your ion assets
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDNlZjk5MC1iMjliLTQ1NTYtYWQ0MC0yMDljZDBhMmMyNWEiLCJpZCI6MTY5MjczLCJpYXQiOjE2OTYwMDMzODJ9.3Q6GkVL_JQrNduboyY_p5ducyy7wlzuglF-npBiY5uc";
  Cesium.GoogleMaps.defaultApiKey = "AIzaSyDTXbPV5vjBAwjN83TF0Wr6afPiusxzxGE";
  viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    //fullscreenButton: false,
    geocoder: false,
    //navigationHelpButton: false,
    selectionIndicator: false,
    sceneModePicker: false,
    animation: false,
    timeline: false,
	
    infoBox: false,
    homeButton: false,
    shouldAnimate: true,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
  });
  
  viewer.resolutionScale = window.devicePixelRatio;
  
  document.getElementsByClassName("cesium-viewer-bottom")[0].remove();
  viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.highDynamicRange = false;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.fog.enabled = false;
  viewer.resolutionScale = window.devicePixelRatio
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  // To see the ground
  layers = viewer.scene.imageryLayers;
  camera = viewer.camera;
  scene = viewer.scene;
  canvas = viewer.scene.canvas;
  globe = scene.globe;
  //Set the random number seed for consistent results.
  Cesium.Math.setRandomNumberSeed(3);

  //Set bounds of our simulation time
  start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  stop = Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate());
  entityPosition = new Cesium.Cartesian3();
  entityOrientation = new Cesium.Quaternion();
  rotationMatrix = new Cesium.Matrix3();
  modelMatrix = new Cesium.Matrix4();
  emitterModelMatrix = new Cesium.Matrix4();
  translation = new Cesium.Cartesian3();
  rotation = new Cesium.Quaternion();
  hpr = new Cesium.HeadingPitchRoll();
  trs = new Cesium.TranslationRotationScale();
  //Make sure viewer is at the desired time.
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
  viewer.clock.multiplier = 1;
  viewer.clock.shouldAnimate = true;
  particleSystem = scene.primitives.add(
    new Cesium.ParticleSystem({
      image: "../images/smoke.png",

      //startColor: Cesium.Color.BLACK.withAlpha(0.4),
      //endColor: Cesium.Color.BLACK.withAlpha(0.8),
	  
	  startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
      endColor: Cesium.Color.WHITE.withAlpha(0.0),
	  
      startScale: viewModel.startScale,
      endScale: viewModel.endScale,

      minimumParticleLife: viewModel.minimumParticleLife,
      maximumParticleLife: viewModel.maximumParticleLife,

      minimumSpeed: viewModel.minimumSpeed,
      maximumSpeed: viewModel.maximumSpeed,

      imageSize: new Cesium.Cartesian2(
        viewModel.particleSize,
        viewModel.particleSize
      ),

      emissionRate: viewModel.emissionRate,

      lifetime: 16.0,
      emitter: new Cesium.CircleEmitter(0.1),
    })
  );
  viewer.camera.setView({
    destination: new Cesium.Cartesian3.fromDegrees(
     
       10.75,
	   47.560,
	   1050
    ),
    orientation: {
      heading: 330.00,
      pitch: -0.10206447042297073,
      roll: 0.0000496391678570518,
    },
  });
  ShowTerrain();
  ShowGoogleMapTileSet();
  ReadRecordJson();
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event) {
    var earthPosition = viewer.scene.pickPosition(event.position);
    var latlonObj = GetlonlatheightfromCartesian(earthPosition);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
});
	
   