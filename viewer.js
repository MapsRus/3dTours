	async function ShowGoogleMapTileSet() {
  // Add Photorealistic 3D Tiles
  try {
    googleTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(googleTileset);
    googleTileset.initialTilesLoaded.addEventListener(function () {
      globe.show = false;
      setTimeout(AnimateToEntity, 2000);
    });
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
  ${error}`);
  }
}
function GetlonlatheightfromCartesian(cartesian) {
  if (Cesium.defined(cartesian)) {
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
    var height = cartographic.height.toFixed(3);
    return { lon: lon, lat: lat, height: height };
  } else {
    return { lon: null, lat: null, height: null };
  }
}
async function ShowTerrain() {
  viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
}
function ReadRecordJson() {
	
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let value = params.tour; // "some_value"



  //$.getJSON("Data/TemperatureBreakers.json", function (data) {
  $.getJSON(value, function (data) {
    $.each(data, async function (key, val) {
      var latlongObj = {
        lon: val.lon,
        lat: val.lat,
        height: null,
      };
      var terrainHeight = await GetTerrainHeightForTileset(latlongObj);
      latlongObj.height = terrainHeight;
      var text =
        "Location: " +
        val.Location +
        "\n" +
		"Description: " +
        val.Description;
		
      var entity = viewer.entities.add({
        name: "tempEntity",
        position: Cesium.Cartesian3.fromDegrees(
          val.lon,
          val.lat,
          terrainHeight
        ),
        model: {
          show: false,
          uri: "Model/scene.gltf",
          minimumPixelSize: 100,
          color: Cesium.Color.RED,
        },
        label: {
          text: text,
          show: false,
          showBackground: true,
          //backgroundColor: Cesium.Color.RED,
          backgroundColor: Cesium.Color.fromCssColorString('#CC2124'),
          //backgroundColor: Cesium.Color.WHITE,
		  
          fillColor: Cesium.Color.WHITE,
		  
		  
          font: "14px 'Roboto', sans-serif, bold",
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          //disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(0, -90),
        },
      });
      var entityObj = {
        entity: entity,
        position: new Cesium.Cartesian3.fromDegrees(
          val.lon,
          val.lat,
          terrainHeight
        ),
      };
      EntityList.push(entityObj);
    });
  });
}
async function GetTerrainHeightForTileset(latlongObj) {
  var positions = [
    Cesium.Cartographic.fromDegrees(
      parseFloat(latlongObj.lon),
      parseFloat(latlongObj.lat)
    ),
  ];
  const terrainProvider = await Cesium.createWorldTerrainAsync();
  const updatedPositions = await Cesium.sampleTerrainMostDetailed(
    terrainProvider,
    positions
  );
  terrainHeight = positions[0].height;
  return terrainHeight;
}

async function AnimateToEntity() {
  currentIndex = 0;
  var options = {
    offset: new Cesium.HeadingPitchRange(0.5, -0.4, 600),
  };
  EntityList[0].entity.label.show = true;
  EntityList[0].entity.model.show = true;
  ShowParticle(EntityList[0].position);
  viewer.flyTo(EntityList[0].entity, options);
  GoToNextPosition(EntityList[0].entity);
}
function GoToNextPosition() {
  setTimeout(() => {
    currentIndex++;
    if (currentIndex == EntityList.length) {
      currentIndex = 0;
      return;
    }
    var options = {
      offset: new Cesium.HeadingPitchRange(0.5, -0.25, 1800),
    };
    EntityList[currentIndex].entity.label.show = true;
    EntityList[currentIndex].entity.model.show = true;
    ShowParticle(EntityList[currentIndex].position);
    viewer.flyTo(EntityList[currentIndex].entity, options);
    GoToNextPosition();
  }, 8000);
}
function computeModelMatrix(entity, time) {
  return entity.computeModelMatrix(time, new Cesium.Matrix4());
}
function computeEmitterModelMatrix() {
  hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
  trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 1.4, translation);
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

  return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
}

function ShowParticle(position) {
  currentPosition = position;
  viewer.scene.preUpdate.addEventListener(function (scene, time) {
    particleSystem.modelMatrix = new Cesium.Matrix4.fromTranslation(position);

    // Account for any changes to the emitter model matrix.
    particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
  });
}
