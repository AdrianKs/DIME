package com.example.entenman.myfirstapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.TextView;

public class DisplayMessageActivity extends AppCompatActivity implements TopFragment.FlightSearcher {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_message);

        Intent intent = getIntent();
        String message = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
        TextView textView = new TextView(this);
        textView.setTextSize(40);
        textView.setText(message);

        ViewGroup layout = (ViewGroup) findViewById(R.id.activity_display_message);
        layout.addView(textView);
    }

    @Override
    public void searchForFlights(String origin, String destination) {
        BottomFragment bottomFragment = (BottomFragment)getFragmentManager().findFragmentById(R.id.bottomFragment);
        int randomPrice = (int)(Math.random()*200);
        String resultString = origin + " - " + destination + " = " + randomPrice;
        bottomFragment.displayFlightQueryResult(resultString);
    }
}
