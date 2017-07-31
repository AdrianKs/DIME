package com.example.entenman.myfirstapp;

import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Created by entenman on 29.11.2016.
 */

public class BottomFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_bottom, container, false);
    }

    public void displayFlightQueryResult(String result){
        TextView resultField = (TextView) getActivity().findViewById(R.id.flightQueryResult);
        resultField.setText(result);
    }
}
