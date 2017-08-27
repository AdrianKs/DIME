package com.example.entenman.myfirstapp;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Spinner;

/**
 * Created by entenman on 29.11.2016.
 */

public class TopFragment extends Fragment {

    private FlightSearcher interfaceImplementor;

    //The interface to communicate to the parent activity
    public interface FlightSearcher{
        public void searchForFlights(String origin, String destination);
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.interfaceImplementor = (FlightSearcher)context;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_top, container, false);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        Button flightSearchButton = (Button)getActivity().findViewById(R.id.button);
        flightSearchButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                Spinner originSpinner = (Spinner)getActivity().findViewById(R.id.origin);
                Spinner destinationSpinner = (Spinner)getActivity().findViewById(R.id.destination);

                interfaceImplementor.searchForFlights(originSpinner.getSelectedItem().toString(), destinationSpinner.getSelectedItem().toString());
            }
        });
    }
}
