const express = require("express")
const app = express()
const { Pool } = require("pg")
const SphericalMercator = require("@mapbox/sphericalmercator")

var fs = require('fs');
var path = require('path');

var compression = require('compression')
var zlib = require('zlib');


const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "vector-tiles",
    password: '123456'
})
const mercator = new SphericalMercator()




app.use(express.static("./"))
app.use(compression())


app.get("/generar", function (req, res) {

function vectorTile(x, y, z) {


    let bbox = mercator.bbox(x, y, z)
    console.log(bbox.join(", "))

    var dir = __dirname + '/' + z;

    var dir_pbf = __dirname + '/' + z +'/' + x;
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }
    if (!fs.existsSync(dir_pbf)) {
        fs.mkdirSync(dir_pbf, 0744);
    }

    const sql = `
    SELECT ST_AsMVT(q, 'mpio', 4096, 'geom')
    FROM (
        SELECT
            nombre_mpio,
            nombre_depto,
            ST_AsMVTGeom(
                geom,
                TileBBox(${z}, ${x}, ${y}, 3857),
                4096,
                0,
                false
            ) geom
        FROM mpio_p
        WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
    ) q`
    const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
    pool.query(sql, values , function(err, mvt) {
            if (err) {
                console.log(err)
            } else {
                
                
                zlib.gzip(mvt.rows[0].st_asmvt, function (_, result) {
                    //fs.writeFileSync("hola.gz", result);
                    fs.writeFileSync(dir_pbf + "/" + y + ".gz", result);
                });
                
            }
    })
}

    var xmin = 2;
    var xmax = 3;
    var ymin = 3;
    var ymax = 4;
    
for (let z = 3; z < 11; z=z+2) {
    for (let x = xmin; x < xmax+1; x++) {
        for (let y = ymin; y < ymax+1; y++) {

            console.log("x: "+x+" y: "+y+" z: "+z)
            vectorTile(x,y,z)
        }

    }
    xmin = xmin * 4;
    xmax = (xmax * 4) + 1;
    ymin = ymin * 4;
    ymax = (ymax * 4) + 1;
}
    
    res.sendStatus(200)

})















app.get("/mvt/:x/:y/:z.pbf", function(req, res) {
    let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
    console.log(bbox.join(", "))

    const sql = `
    SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
    FROM (
        SELECT
            ST_AsMVTGeom(
                geom,
                TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 3857),
                4096,
                0,
                false
            ) geom
        FROM sector_rural_p
        WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
    ) q`
    const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
    pool.query(sql, values , function(err, mvt) {
            if (err) {
                console.log(err)
                response.status(400)
            } else {
              //console.log(mvt.rows[0].st_asmvt)
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/x-protobuf')
                fs.writeFileSync("foo.pbf", mvt.rows[0].st_asmvt);
                res.send(mvt.rows[0].st_asmvt)
            }
    })
})


app.get('/layer/:x/:y/:z.pbf', function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');

    const z = req.params.z;
    const x = req.params.x;
    const y = req.params.y;
    var file = __dirname + '/' + z + '/' + x + '/' + y + '.gz';
    console.log(file)
    
    if (fs.existsSync(file)) {
        var fileDos = fs.readFileSync(file);

        res.writeHead(200, {'Content-Type': 'application/x-protobuf', 'Content-Encoding': 'gzip'});

        res.end(fileDos);


    } else {
        res.sendStatus(400)
    }

  });



app.listen(9000, () => {
    console.log("Listening on port 9000")
})