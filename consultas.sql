SELECT (ST_AsMVTGeom(
	ST_GeomFromText('POLYGON ((0 0, 10 0, 10 5, 0 -5, 0 0))'),
	ST_MakeBox2D(ST_Point(0, 0), ST_Point(4096, 4096)),
	4096, 0, false));
	
SELECT	ST_AsMVTGeom(geom, ST_MakeEnvelope( -74.5, 4, -74, 4.5 ,4326), 4096, 256, false )
from sector_rural_p


/*
CREATE TABLE mpio_p AS 
  SELECT mpio_cnmbr as nombre_mpio,dpto_cnmbr as nombre_depto,ST_Transform(geom,3857) AS geom 
  FROM mpio;
  
  */
drop table   mpio_p
 select TileBBox(14, 2408, 3991, 3857)
  
  select * from mpio limit 1
  
        SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
        FROM (
            SELECT
                ST_AsMVTGeom(
                    geom,
                    TileBBox(13, 2409, 3989, 3857),
                    4096,
                    0,
                    false
                ) geom
            FROM sector_rural_p
  			WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope(-74.1357421875, 4.653079918274051, -74.091796875, 4.696879026871425,4326), 3857)))
        ) q
  http://localhost:9000/mvt/2409/3989/13
  
  
  select ST_Transform(st_intersection(geom, TileBBox(14, 2408, 3991, 3857)),4326)
  FROM sector_rural_p
  WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope(-8354108.5694,448532.4820,-8139932.0161,589176.6140,3857), 3857)))
  
  
    (SELECT ST_Transform(ST_MakeEnvelope(-8354108.5694,448532.4820,-8139932.0161,589176.6140,3857), 4326))


select ST_SRID(geom) from 

  
  
  create or replace function TileBBox (z int, x int, y int, srid int = 3857)
    returns geometry
    language plpgsql immutable as
$func$
declare
    max numeric := 20037508.34;
    res numeric := (max*2)/(2^z);
    bbox geometry;
begin
    bbox := ST_MakeEnvelope(
        -max + (x * res),
        max - (y * res),
        -max + (x * res) + res,
        max - (y * res) - res,
        3857
    );
    if srid = 3857 then
        return bbox;
    else
        return ST_Transform(bbox, srid);
    end if;
end;
$func$;





