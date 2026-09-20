PRAGMA foreign_keys = ON;

-- Canonical public ecosystem registry: 22 public properties.
-- Legal owner is intentionally left NULL where ownership has not been explicitly
-- confirmed in the shared project record. Royal Up With The Hughes is recorded
-- as jointly owned by Jason Hughes & April Sanders per Phase 0.

INSERT OR IGNORE INTO brands (id,name,slug,legal_owner) VALUES
('BRD-ATECHUCATION','A+ Techucation','atechucation',NULL),
('BRD-CREATOR','ATechSpot Creator','creator',NULL),
('BRD-REMOTECARE','RemoteCare','remotecare',NULL),
('BRD-TECHGURU','Tech Guru','techguru',NULL),
('BRD-ACLEANSWEEP','A Clean Sweep','acleansweep',NULL),
('BRD-VISIONOFSANDERS','Vision of Sanders','visionofsanders',NULL),
('BRD-ASTUDIOMX','A Studio MX','astudiomx',NULL),
('BRD-IAMMODELING','I Am Modeling','iammodeling',NULL),
('BRD-MRAPLUSPORTFOLIO','Mr. A Plus Portfolio','mraplusportfolio',NULL),
('BRD-ABCTECHPRODUCTS','ABC Tech Products','abctechproducts',NULL),
('BRD-ATECHSPOTDJI','ATechSpot DJI','atechspot-dji',NULL),
('BRD-ATECHUCATIONFIGURES','A+ Techucation Figures','atechucationfigures',NULL),
('BRD-WARRIORJ','WarriorJ','warriorj',NULL),
('BRD-AUTO','A+ Automotive Technology','auto',NULL),
('BRD-CREDIT','A+ Credit Education','credit',NULL),
('BRD-ASCRFINANCIAL','ASCR Financial','ascrfinancial',NULL),
('BRD-ABCOFTECH','ABC of Technology','abcoftech',NULL),
('BRD-HAZIL','HÄZIL','hazil',NULL),
('BRD-ROYALUP','Royal Up With The Hughes','royalupwiththehughes','Jason Hughes & April Sanders'),
('BRD-ATECHNETWORK','ATech Network','atechnetwork',NULL),
('BRD-HAZILFLIX','HazilFlix','hazilflix',NULL);

INSERT OR IGNORE INTO properties (id,brand_id,hostname,name,property_type,access_level,status) VALUES
('PROP-ATECHSPOT-PUBLIC','BRD-ATECHSPOT','atechspot.com','ATechSpot','public','public','active'),
('PROP-ATECHUCATION','BRD-ATECHUCATION','atechucation.atechspot.com','A+ Techucation','public','public','registry'),
('PROP-CREATOR','BRD-CREATOR','creator.atechspot.com','ATechSpot Creator','public','public','registry'),
('PROP-REMOTECARE','BRD-REMOTECARE','remotecare.atechspot.com','RemoteCare','public','public','registry'),
('PROP-TECHGURU','BRD-TECHGURU','techguru.atechspot.com','Tech Guru','public','public','registry'),
('PROP-ACLEANSWEEP','BRD-ACLEANSWEEP','acleansweep.atechspot.com','A Clean Sweep','public','public','registry'),
('PROP-VISIONOFSANDERS','BRD-VISIONOFSANDERS','visionofsanders.atechspot.com','Vision of Sanders','public','public','registry'),
('PROP-ASTUDIOMX','BRD-ASTUDIOMX','astudiomx.atechspot.com','A Studio MX','public','public','registry'),
('PROP-IAMMODELING','BRD-IAMMODELING','iammodeling.atechspot.com','I Am Modeling','public','public','registry'),
('PROP-MRAPLUSPORTFOLIO','BRD-MRAPLUSPORTFOLIO','mraplusportfolio.atechspot.com','Mr. A Plus Portfolio','public','public','registry'),
('PROP-ABCTECHPRODUCTS','BRD-ABCTECHPRODUCTS','abctechproducts.atechspot.com','ABC Tech Products','public','public','registry'),
('PROP-ATECHSPOTDJI','BRD-ATECHSPOTDJI','atechspot.com/dji/','ATechSpot DJI','public-path','public','registry'),
('PROP-ATECHUCATIONFIGURES','BRD-ATECHUCATIONFIGURES','atechucationfigures.atechspot.com','A+ Techucation Figures','public','public','registry'),
('PROP-WARRIORJ','BRD-WARRIORJ','warriorj.com','WarriorJ','public','public','registry'),
('PROP-AUTO','BRD-AUTO','auto.atechspot.com','A+ Automotive Technology','public','public','registry'),
('PROP-CREDIT','BRD-CREDIT','credit.atechspot.com','A+ Credit Education','public','public','registry'),
('PROP-ASCRFINANCIAL','BRD-ASCRFINANCIAL','ascrfinancial.atechspot.com','ASCR Financial','public','public','registry'),
('PROP-ABCOFTECH','BRD-ABCOFTECH','abcoftech.atechspot.com','ABC of Technology','public','public','registry'),
('PROP-HAZIL','BRD-HAZIL','hazil.atechspot.com','HÄZIL','public','public','registry'),
('PROP-ROYALUP','BRD-ROYALUP','royalupwiththehughes.atechspot.com','Royal Up With The Hughes','public','public','registry'),
('PROP-ATECHNETWORK','BRD-ATECHNETWORK','atechnetwork.atechspot.com','ATech Network','public','public','registry'),
('PROP-HAZILFLIX','BRD-HAZILFLIX','hazilflix.atechspot.com','HazilFlix','public','public','registry');
