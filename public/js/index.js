var page=window.page||{};
var control,stats;
$(document).ready(function(){
    initScene();
    getStlFile("/stl/Octocat-v1.stl");
    //getStlFile("/stl/3DR_Extruder_body_V2_Test_001_RTP.stl");
    //getStlFile("brackets.stl");
    bindEvent();
    animate();
});
function createFloor(){
    var line_material = new THREE.LineBasicMaterial({ color: 0x000000, gapSize:2 });
    var geom=new THREE.Geometry();
        for(var i=0;i<220;i+=20){
            geom.vertices.push(new THREE.Vector3(i,0,0));
            geom.vertices.push(new THREE.Vector3(i,200,0));
        }
        for(var i=0;i<220;i+=20){
            geom.vertices.push(new THREE.Vector3(0,i,0));
            geom.vertices.push(new THREE.Vector3(200,i,0));
        }
    var floor= new THREE.Line(geom,line_material);
    floor.type = THREE.LinePieces;
    floor.position.x=-100;
    floor.position.y=0;
    floor.rotation.x=(Math.PI/180)*90;

    window.floor=floor;
    return floor;

}

function bindEvent(){
    document.getElementById("file").addEventListener("change",function(evt){
        var file=evt.target.files[0];
        var blob=file.slice(0,5);

        var filereader=new FileReader();
        //filereader.readAsBinaryString(blob);
        filereader.readAsArrayBuffer(file);
        filereader.onload=function(e){
            console.log(e);
             // var   geo=ParseStl.parseStlBinary(e.target.result);
                ParseStl.parseStl(file,function(geo){
                    var mesh=createAMesh(geo);
                    mesh.position.x = 0;
                    mesh.position.y = 0;
                    mesh.position.z = 0;
                    mesh.rotation.x= 0;
                    mesh.rotation.y= 0;
                    mesh.rotation.x = -Math.PI/180*90;
                    scene.add(mesh);
                });
            };
        },false);
}
function getStlFile(path){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 || xhr.status == 0 ) {
                var rep=xhr.response;
                    ParseStl.parseStlBinary(rep,function(geo){
                    var mesh=createAMesh(geo);
                    mesh.position.x = 0;
                    mesh.position.y = 0;
                    mesh.position.z = 0;
                    mesh.rotation.y= 0;
                    mesh.rotation.z= 0;
                    mesh.rotation.x = -Math.PI/180*90;
                    scene.add(mesh);
                    
                    });
                console.log('done parsing');
            }
        }
    }
    xhr.onerror = function(e) {
        console.log(e);
    }
    
    //xhr.open( "GET", 'Octocat-v1.stl', true );
    xhr.open( "GET", path, true );
    xhr.responseType = "arraybuffer";
    //xhr.setRequestHeader("Accept","text/plain");
    //xhr.setRequestHeader("Content-Type","text/plain");
    //xhr.setRequestHeader('charset', 'x-user-defined');
    xhr.send( null );
    
    }
function createAMesh(geo){
    var mesh = new THREE.Mesh( 
        geo, // new THREE.MeshNormalMaterial({
        //     overdraw:true
        // }
        new THREE.MeshLambertMaterial({
            overdraw:true,
            color: 0x688CA3,
            shading: THREE.FlatShading
        }
    ));
    return mesh;
}
function initScene() {
    //Detector.addGetWebGLMessage();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 140;
    camera.position.y = 0;
    camera.position.x = 0;
    //camera.rotation.y =Math.PI/360*180;
    scene.add( camera );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = 0; 
    directionalLight.position.y = 0; 
    directionalLight.position.z = 1; 
    directionalLight.position.normalize();
    scene.add( directionalLight );
    window.directionalLight=directionalLight;  
    var floor=createFloor();
    scene.add(floor);
    

    renderer = new THREE.WebGLRenderer({antialias:true}); 
    //renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xffffff, 1);

    document.getElementById("window").appendChild(renderer.domElement);
/*
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById("window").appendChild(stats.domElement);
    document.body.appendChild(stats.domElement);
*/
    control=new THREE.OrbitControls(camera);
    control.rotateLeft(0.5);
    control.rotateUp(0.5);
    control.update();
}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    directionalLight.position=camera.position;
}
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}
