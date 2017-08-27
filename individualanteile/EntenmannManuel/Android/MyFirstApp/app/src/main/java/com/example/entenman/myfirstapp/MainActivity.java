package com.example.entenman.myfirstapp;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Camera;
import android.location.LocationManager;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.support.v4.app.FragmentActivity;
import android.support.v4.os.EnvironmentCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import java.io.FileOutputStream;


public class MainActivity extends AppCompatActivity {

    private String message = "";
    static final String TEXT_VALUE = "textValue";
    public final static String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Make sure we're running on Honeycomb or higher to use ActionBar APIs
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB){
            ActionBar actionBar = getSupportActionBar();
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

        //Check wheter we're recreating a previously destroyed instance
        if(savedInstanceState != null){
            message = savedInstanceState.getString(TEXT_VALUE);
        }else{
            //Default initial value
        }
    }

    @Override
    public void onDestroy(){
        super.onDestroy();
        //Stop method tracing that the activity started during onCreate()
        android.os.Debug.stopMethodTracing();
    }

    // Camera mCamera;

    @Override
    public void onPause(){
        super.onPause();
        /*
        if(mCamera != null){
            mCamera.release();
            mCamera = null;
        }*/
    }

    @Override
    public void onResume(){
        super.onResume();

        /*
        if(mCamera == null){
            initializeCamera();
        }
         */
    }

    @Override
    public void onStop(){
        super.onStop();

        /**Things to save*/
    }

    @Override
    protected void onStart(){
        super.onStart();

        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        boolean gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        System.out.println(gpsEnabled);

        if(!gpsEnabled){
          showGPSDialog(this);
        }
    }

    @Override
    protected void onRestart(){
        super.onRestart();

        //Activity being restarted from stopped state
    }

    @Override
    public void onSaveInstanceState(Bundle savedInstanceState){
        //Save the user's current text
        savedInstanceState.putString(TEXT_VALUE, message);

        super.onSaveInstanceState(savedInstanceState);
    }

    /** Called when the user Clicks the Send button */
    public void sendMessage(View view){
        Intent intent = new Intent(this, DisplayMessageActivity.class);
        EditText editText = (EditText) findViewById(R.id.edit_message);
        message = editText.getText().toString();
        intent.putExtra(EXTRA_MESSAGE, message);
        startActivity(intent);
    }

    /**
     * Save message on internal storage
     */
    public void saveMessage(View view){
        EditText editText = (EditText) findViewById(R.id.edit_message);
        message = editText.getText().toString();

        String filename = "myfile";
        FileOutputStream outputStream;

        try {
            outputStream = openFileOutput(filename, Context.MODE_PRIVATE);
            outputStream.write(message.getBytes());
            outputStream.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * Save message on external storage
     */
    public void saveMessageExternal(View view){

        if(isExternalStorageWritable()){
            //save file on external storage
        }

    }

    //Check if external storage is available for read and write
    private boolean isExternalStorageWritable() {
        String state = Environment.getExternalStorageState();
        if(Environment.MEDIA_MOUNTED.equals(state)){
            return true;
        }
        return false;
    }


    /*
    Open Dialog to enable GPS
     */
    public static void showGPSDialog(final Activity activity)
    {

        final AlertDialog.Builder builder =  new AlertDialog.Builder(activity);
        final String action = Settings.ACTION_LOCATION_SOURCE_SETTINGS;
        final String message = "Would you like to open the GPS settings?";

        builder.setMessage(message)
                .setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface d, int id) {
                                activity.startActivity(new Intent(action));
                                d.dismiss();
                            }
                        })
                .setNegativeButton("Cancel",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface d, int id) {
                                d.cancel();
                            }
                        });
        builder.create().show();
    }
}

