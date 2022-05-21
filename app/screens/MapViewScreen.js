
import React, { useEffect, useState } from "react";
import { ScrollView,StyleSheet } from "react-native";
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';
import AppButton from "../components/buttons/Tab";
import colors from "../config/colors";
import Geolocation from '@react-native-community/geolocation';
import routes from "../navigation/routes";


export default function MapViewScreen ({navigation,location}) { 
    useEffect(() => {
        Geolocation.getCurrentPosition((pos) => {
          const crd = pos.coords;
          setRegion({
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });
        }).catch((err) => {
          console.error(err);
        });
      }, []);
    
 
    const[region,setRegion] = useState({region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      })

    const onRegionChange=(region) =>{
        setRegion(region);
      }
    const confirmLocation = () => {
        location = region
        console.log(region)
        navigation.navigate(routes.SHIPPING_ADDRESS)
    }
      
      
        return (
            <ScrollView contentContainerStyle={{flex:1,flexDirection:"column",}}>
          <MapView
            style={{height:"50%"}} 
            region={region}
            showsUserLocation={true} 
            onRegionChange={onRegionChange}
          >
    
    <Marker draggable
      coordinate={{ latitude : region.latitude , longitude : region.longitude }}
      title={"marker.title"}
      description={"marker.description"}
    />
 
        </MapView>
        <AppButton
          onPress={()=> confirmLocation()}
          style={styles.payButton}
          title={"Confirm Location"}
          width={"70%"}
          color={colors.iondigoDye}
          fontColor={colors.white}
        />
        </ScrollView>
        );
                            
}
const styles = StyleSheet.create({

    payButton: {
      borderRadius: 12,
      marginVertical: 50,
      marginHorizontal: "15%",
    },
  
  });
  